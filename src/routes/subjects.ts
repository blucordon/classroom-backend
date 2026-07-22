import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { Router, type Request, type Response } from "express";
import { departments, subjects } from "../db/schema/app.js";
import { db } from "../db.js";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, department, page, limit } = req.query;

    const searchText =
      typeof search === "string"
        ? search
        : Array.isArray(search)
          ? search[0]
          : undefined;

    const departmentText =
      typeof department === "string"
        ? department
        : Array.isArray(department)
          ? department[0]
          : undefined;

    const parsedPage = Number.parseInt(String(page ?? "1"), 10);
    const parsedLimit = Number.parseInt(String(limit ?? "10"), 10);

    const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limitPerPage =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];
    if (searchText) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${searchText}%`),
          ilike(subjects.code, `%${searchText}%`),
        ),
      );
    }

    if (departmentText) {
      filterConditions.push(ilike(departments.name, `%${departmentText}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: {
          ...getTableColumns(departments),
        },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /api/subjects ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
