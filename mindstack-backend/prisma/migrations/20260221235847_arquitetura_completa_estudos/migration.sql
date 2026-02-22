/*
  Warnings:

  - You are about to drop the column `concluida` on the `Aula` table. All the data in the column will be lost.
  - You are about to drop the column `falta` on the `Aula` table. All the data in the column will be lost.
  - You are about to drop the column `linkAcesso` on the `Aula` table. All the data in the column will be lost.
  - You are about to drop the column `moduloId` on the `Aula` table. All the data in the column will be lost.
  - You are about to drop the column `sincrona` on the `Aula` table. All the data in the column will be lost.
  - You are about to drop the column `dataFim` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Curso` table. All the data in the column will be lost.
  - The `status` column on the `Curso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cursoId` on the `Resumo` table. All the data in the column will be lost.
  - You are about to drop the `Modulo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResumoIA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillCurso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trabalho` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `disciplinaId` to the `Aula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Aula` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Curso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `disciplinaId` to the `Resumo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoCurso" AS ENUM ('GRADUACAO', 'POS_GRADUACAO', 'CURSO_LIVRE', 'CERTIFICACAO');

-- CreateEnum
CREATE TYPE "StatusCurso" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'PAUSADO');

-- CreateEnum
CREATE TYPE "StatusPresenca" AS ENUM ('PENDENTE', 'PRESENTE', 'FALTA', 'ASSISTIDA_GRAVADA');

-- CreateEnum
CREATE TYPE "StatusTarefa" AS ENUM ('PENDENTE', 'FAZENDO', 'CONCLUIDA', 'ATRASADA');

-- DropForeignKey
ALTER TABLE "Aula" DROP CONSTRAINT "Aula_moduloId_fkey";

-- DropForeignKey
ALTER TABLE "Modulo" DROP CONSTRAINT "Modulo_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "Resumo" DROP CONSTRAINT "Resumo_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "ResumoIA" DROP CONSTRAINT "ResumoIA_aulaId_fkey";

-- DropForeignKey
ALTER TABLE "SkillCurso" DROP CONSTRAINT "SkillCurso_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "SkillCurso" DROP CONSTRAINT "SkillCurso_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Trabalho" DROP CONSTRAINT "Trabalho_moduloId_fkey";

-- AlterTable
ALTER TABLE "Aula" DROP COLUMN "concluida",
DROP COLUMN "falta",
DROP COLUMN "linkAcesso",
DROP COLUMN "moduloId",
DROP COLUMN "sincrona",
ADD COLUMN     "disciplinaId" TEXT NOT NULL,
ADD COLUMN     "linkVideo" TEXT,
ADD COLUMN     "status" "StatusPresenca" NOT NULL DEFAULT 'PENDENTE',
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusCurso" NOT NULL DEFAULT 'EM_ANDAMENTO',
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoCurso" NOT NULL;

-- AlterTable
ALTER TABLE "Resumo" DROP COLUMN "cursoId",
ADD COLUMN     "aulaId" TEXT,
ADD COLUMN     "disciplinaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Modulo";

-- DropTable
DROP TABLE "ResumoIA";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "SkillCurso";

-- DropTable
DROP TABLE "Trabalho";

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "professor" TEXT,
    "maxFaltasPermitidas" INTEGER,
    "cursoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL,
    "nomeProva" TEXT NOT NULL,
    "notaObtida" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION DEFAULT 1.0,
    "disciplinaId" TEXT NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataEntrega" TIMESTAMP(3) NOT NULL,
    "status" "StatusTarefa" NOT NULL DEFAULT 'PENDENTE',
    "disciplinaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Tarefa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resumo" ADD CONSTRAINT "Resumo_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resumo" ADD CONSTRAINT "Resumo_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;
