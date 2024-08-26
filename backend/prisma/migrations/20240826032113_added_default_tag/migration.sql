-- AlterTable
CREATE SEQUENCE groups_id_seq;
ALTER TABLE "Groups" ALTER COLUMN "id" SET DEFAULT nextval('groups_id_seq');
ALTER SEQUENCE groups_id_seq OWNED BY "Groups"."id";

-- AlterTable
CREATE SEQUENCE members_id_seq;
ALTER TABLE "Members" ALTER COLUMN "id" SET DEFAULT nextval('members_id_seq');
ALTER SEQUENCE members_id_seq OWNED BY "Members"."id";

-- AlterTable
CREATE SEQUENCE transactions_id_seq;
ALTER TABLE "Transactions" ALTER COLUMN "id" SET DEFAULT nextval('transactions_id_seq');
ALTER SEQUENCE transactions_id_seq OWNED BY "Transactions"."id";
