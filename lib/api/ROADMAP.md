# Roadmaps - Análise e Implementação

## 📊 Status dos Endpoints Existentes

### ✅ **Projetos - PRONTO para Roadmap**
Os endpoints de Milestones já têm tudo necessário:
- `GET /api/projects/{projectId}/milestones` - Lista milestones
- `POST /api/projects/{projectId}/milestones` - Cria milestone
- `PUT /api/projects/milestones/{id}` - Atualiza milestone
- `DELETE /api/projects/milestones/{id}` - Deleta milestone

**Campos disponíveis:**
- `dueDate` - Data prevista
- `completed` - Status de conclusão
- `title` - Título
- `description` - Descrição

**✅ Pode criar roadmap visual imediatamente usando esses endpoints!**

---

### ⚠️ **Estudos - PARCIALMENTE pronto**
Endpoints existentes:
- `GET /api/studies/subjects` - Lista subjects
- `GET /api/studies/subjects/{subjectId}/sessions` - Lista sessions

**Campos disponíveis:**
- `proficiencyLevel` (BEGINNER, INTERMEDIATE, ADVANCED)
- `professionalLevel` (JUNIOR, PLENO, SENIOR)
- `startTime` - Data/hora da sessão
- `durationMinutes` - Duração

**✅ Pode criar roadmap de progressão de níveis usando esses dados!**

**💡 Sugestão:** Adicionar campo `targetDate` ou `goalDate` em Subject para criar roadmap de objetivos.

---

### ❌ **Anotações - PRECISA criar endpoints**

**Situação atual:**
- Anotações estão apenas como campo `notes` dentro de Sessions
- Componente frontend usa dados mock
- Não há endpoints específicos para anotações independentes

**Endpoints sugeridos para criar na API:**

```typescript
// Anotações de Estudo
GET    /api/studies/notes                    // Lista todas as anotações
GET    /api/studies/notes/{id}                // Busca anotação por ID
GET    /api/studies/subjects/{subjectId}/notes // Anotações de um subject
POST   /api/studies/notes                     // Cria anotação
PUT    /api/studies/notes/{id}                 // Atualiza anotação
DELETE /api/studies/notes/{id}                // Deleta anotação
```

**Estrutura sugerida:**
```typescript
interface StudyNote {
  id: number
  subjectId?: number
  subjectName?: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt?: string
  sessionId?: number
}
```

---

## 🎯 Implementação Frontend

### Roadmap de Projetos
**Usando endpoints existentes:**
- Componente: `components/projetos/project-roadmap.tsx`
- Usa: `projectsService.getMilestones(projectId)`
- Visualização: Timeline horizontal com milestones

### Roadmap de Estudos
**Usando endpoints existentes:**
- Componente: `components/studies/study-roadmap.tsx`
- Usa: `studiesService.getAllSubjects()` + `studiesService.getSessions()`
- Visualização: Progressão de níveis ao longo do tempo

### Roadmap de Anotações
**Aguardando endpoints:**
- Componente: `components/studies/notes-roadmap.tsx`
- Usará: Endpoints novos quando criados
- Visualização: Timeline de criação de anotações por assunto

---

## 📝 Resumo

| Recurso | Status API | Pode Implementar? |
|---------|-----------|-------------------|
| Roadmap de Projetos | ✅ Completo | ✅ Sim, agora |
| Roadmap de Estudos | ⚠️ Parcial | ✅ Sim, com limitações |
| Roadmap de Anotações | ❌ Não existe | ⏳ Aguardando API |

---

## 🚀 Próximos Passos

1. **Implementar roadmap de projetos** usando milestones existentes
2. **Implementar roadmap de estudos** usando subjects e sessions
3. **Criar endpoints de anotações na API** (backend)
4. **Implementar roadmap de anotações** após endpoints criados

