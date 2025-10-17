-- CreateTable
CREATE TABLE "TimeTable" (
    "id" TEXT NOT NULL,
    "major_id" TEXT,
    "mi_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "day" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "time_start" TIMESTAMP(3),
    "time_end" TIMESTAMP(3),
    "object_type" TEXT NOT NULL,
    "object_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeTable_pkey" PRIMARY KEY ("id")
);
