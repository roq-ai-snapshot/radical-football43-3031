-- CreateTable
CREATE TABLE "academy" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "user_id" UUID,

    CONSTRAINT "academy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "academy_id" UUID,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,

    CONSTRAINT "coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sender_id" UUID,
    "receiver_id" UUID,
    "message" VARCHAR NOT NULL,
    "date_sent" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_goal" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "player_id" UUID,
    "description" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "development_goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_data" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "player_id" UUID,
    "data_type" VARCHAR NOT NULL,
    "value" INTEGER NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "performance_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "academy_id" UUID,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "position" VARCHAR NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_exercise" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "coach_id" UUID,
    "player_id" UUID,
    "description" VARCHAR NOT NULL,
    "date_assigned" DATE NOT NULL,
    "date_due" DATE NOT NULL,
    "status" VARCHAR NOT NULL,

    CONSTRAINT "training_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "email" VARCHAR(255),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "academy" ADD CONSTRAINT "academy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coach" ADD CONSTRAINT "coach_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "coach" ADD CONSTRAINT "coach_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communication" ADD CONSTRAINT "communication_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "communication" ADD CONSTRAINT "communication_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "development_goal" ADD CONSTRAINT "development_goal_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "performance_data" ADD CONSTRAINT "performance_data_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "academy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_exercise" ADD CONSTRAINT "training_exercise_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_exercise" ADD CONSTRAINT "training_exercise_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

