-- CreateTable
CREATE TABLE "Resumo" (
    "id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tamanhoOriginal" INTEGER NOT NULL,
    "cursoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resumo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resumo" ADD CONSTRAINT "Resumo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
