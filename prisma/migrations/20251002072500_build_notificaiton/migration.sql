-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "object_type" TEXT,
    "object_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationUser" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotificationUser" ADD CONSTRAINT "NotificationUser_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
