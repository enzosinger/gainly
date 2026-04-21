import { normalizeMuscleGroup } from "../../lib/muscle-groups";
import type { MuscleGroup, TechniqueType } from "../types/domain";

export type Language = "en" | "pt";

export const languageStorageKey = "gainly-language";

const translations = {
  en: {
    app: {
      loading: "Connecting to your training workspace...",
    },
    language: {
      label: "Language",
      english: "EN/US",
      portuguese: "PT/BR",
    },
    shell: {
      navigationLabel: "Primary navigation",
      mobileNavigationLabel: "Primary mobile navigation",
      modeLabel: "Mode",
      modeValue: "Monochrome Athletic",
      nav: {
        dashboard: "Dashboard",
        routines: "Routines",
        exercises: "Exercises",
        profile: "Profile",
      },
    },
    landing: {
      title: "Training OS for lifters who want structure without noise.",
      description:
        "Build routines, log sessions, and keep your training progress tied to your account.",
    },
    auth: {
      welcomeBack: "Welcome back",
      createAccount: "Create your account",
      email: "Email",
      password: "Password",
      submitLoading: "Please wait",
      signIn: "Sign in",
      createAccountAction: "Create account",
      toggleToSignUp: "Need an account?",
      toggleToSignIn: "Already have an account?",
      invalidEmail: "Enter a valid email address.",
      signInFailed: "Unable to sign in with that email and password.",
      signUpFailed: "Unable to create an account right now. Please try again.",
      accountExists: "An account with that email already exists.",
      invalidPassword: "Use at least 8 characters for your password.",
      genericError: "Something went wrong. Please try again.",
    },
    dashboard: {
      eyebrow: "Weekly review",
      title: "Your training week",
      description:
        "Review a Monday-to-Sunday window and compare weekly completion and load progression across your routines.",
      emptyTitle: "No routines yet",
      emptyBody: "Create your first routine to start tracking weekly completion and workout progress.",
      emptyAction: "Go to routines",
    },
    week: {
      previous: "Previous week",
      next: "Next week",
    },
    routines: {
      eyebrow: "Routine library",
      title: "Routines",
      description: "Create new routines here, then open one to refine its exercises and set structure.",
      available: (count: number) => `${count} routine${count === 1 ? "" : "s"} available`,
      toggleCreate: "Create new",
      cancel: "Cancel",
      createLabel: "Routine name",
      createPlaceholder: "Upper strength",
      createAction: "Create routine",
      close: "Close",
      empty: "No routines yet. Create one to start building.",
      deleteTitle: "Delete routine?",
      deleteDescription: (name?: string) =>
        name
          ? `Delete ${name}? This will remove the routine and its workout history.`
          : "This will remove the routine and its workout history.",
      deleteAction: "Delete routine",
      backToRoutines: "Back to routines",
      editRoutine: "Edit routine",
      viewWorkout: "View workout",
      logWorkout: (name: string) => `Log ${name} workout`,
      previousDelta: "Progression",
      noHistory: "No history",
      deleteRoutineButton: (name: string) => `Delete ${name} routine`,
    },
    routineDetail: {
      eyebrow: "Routine editor",
      notFoundTitle: "Routine not found",
      notFoundDescription: "The requested routine does not exist or was removed.",
      titleSuffix: "builder",
      description:
        "Build the session from a clean baseline, then layer in advanced techniques deliberately.",
      emptyState: "Add an exercise to start shaping this routine.",
      routineLabel: "Routine",
    },
    exercises: {
      eyebrow: "Exercise library",
      title: "Exercises",
      description:
        "Keep the shared movement catalog tidy so the builder and workout flow speak the same language.",
      filterLabel: "Filter by muscle group",
      toggleCreate: "Create exercise",
      createEyebrow: "Create exercise",
      createTitle: "Add a movement to the shared library",
      createDescription: "Keep the movement catalog tidy so routines and workouts stay in sync.",
      nameLabel: "Exercise name",
      muscleGroupLabel: "Muscle group",
      descriptionLabel: "Description",
      createAction: "Save exercise",
      close: "Close",
      namePlaceholder: "Romanian Deadlift",
      descriptionPlaceholder: "Short note about how to perform or program it",
      allMuscleGroups: "All muscle groups",
      emptyByGroup: "No exercises match this muscle group.",
      emptyByFilters: "No exercises match these filters.",
      exerciseEyebrow: "Exercise",
      noDescription: "No description added yet.",
      cancelEditing: (name: string) => `Cancel editing ${name} exercise`,
      confirmChanges: (name: string) => `Confirm changes for ${name} exercise`,
      editExercise: (name: string) => `Edit ${name} exercise`,
      deleteExercise: (name: string) => `Delete ${name} exercise`,
      deleteTitle: "Delete exercise?",
      deleteDescription: (name?: string) =>
        name
          ? `Delete ${name}? This will remove it from your routines and workout history.`
          : "This will remove the exercise from your routines and workout history.",
      deleteAction: "Delete exercise",
      cancelAction: "Cancel",
      searchLabel: "Search exercises",
      searchPlaceholder: "Search by name",
      addToast: "Exercise added",
      muscleGroupFilterLabel: "Muscle group filter",
      createCardTitle: "Add a movement to the shared library",
      createCardDescription: "Keep the movement catalog tidy so routines and workouts stay in sync.",
      createButtonLabel: "Create exercise",
    },
    profile: {
      eyebrow: "Athlete profile",
      title: "Profile",
      description:
        "Maintain a clear baseline of your current training footprint and weekly workload capacity.",
      appearance: "Appearance",
      darkMode: "Dark mode",
      enhancedFocus: "Enhanced athlete focus",
      maximumVisibility: "Maximum visibility",
      followSystemPreference: "Follow system preference",
      auto: "Auto",
      account: "Account",
      signOut: "Sign out",
      routines: "Routines",
      exerciseLibrary: "Exercise library",
      weeklySets: "Weekly sets",
      weeklyVolume: {
        title: "Current week volume",
        plannedSets: "Planned sets",
        status: {
          low: "Low",
          moderate: "Moderate",
          high: "High",
        },
      },
      language: "Language",
      gainlyAthlete: "Gainly athlete",
      signedIn: "Signed in",
    },
    workout: {
      title: "Workout",
      noWorkout: "No workout available.",
      restoringEyebrow: "Workout session",
      restoringTitle: "Restoring workout session",
      restoringDescription:
        "Restoring your workout session and pulling the last week-scoped logged set values.",
      restoringBody: "Preparing your workout session...",
      description:
        "Track each set with current inputs and keep the previous workout from the selected week visible for comparison.",
      routineWorkout: (name: string) => `${name} workout`,
      completed: "Workout completed.",
      activeSession: "Changes are saved into the active session.",
      completeSession: "Complete session",
      restoreError: "Unable to restore this workout session. Please refresh and try again.",
      saveError: "Unable to save that set right now.",
      completeError: "Unable to complete this session right now.",
    },
    library: {
      addExercise: "Add exercise",
      addExerciseDescription: "Pull from the library or create a movement for this routine.",
      createNew: "Create new",
      collapseAdd: "Collapse add exercise",
      expandAdd: "Expand add exercise",
      searchLabel: "Search exercises",
      searchPlaceholder: "Search by name",
      filterLabel: "Filter by muscle group",
      createEyebrow: "Create exercise",
      createDescription: "Keep the movement catalog tidy so routines and workouts stay in sync.",
      noMatches: "No exercises match these filters.",
      addedToast: "Exercise added",
    },
    builder: {
      exerciseIndex: (index: number) => `Exercise ${index}`,
      repRange: "Rep range",
      repRangeMin: "Minimum reps",
      repRangeMax: "Maximum reps",
      warmupSets: "WU",
      feederSets: "FS",
      addSet: "Add set",
      addSuperset: "Add superset",
      removeExercise: "Remove exercise",
      removeSet: "Remove set",
      addTechnique: "Add technique",
      supersetInstructions: "Select two different exercises to build the superset.",
      supersetSelectFirst: "Select the first exercise",
      supersetSelectSecond: "Select the second exercise",
      supersetCancel: "Cancel",
      supersetSameExercise: "Choose two different exercises.",
      techniqueMenu: {
        backoff: "Back-off set",
        cluster: "Cluster set",
        superset: "Super set",
      },
      setIndex: (index: number) => `Set ${index}`,
      noDescription: "No description added yet.",
      pairedWith: (name: string) => `Paired with ${name}`,
      pairWeight: "Pair weight",
      pairReps: "Pair reps",
      weight: "Weight",
      reps: "Reps",
      lastWorkout: (summary: string) => `Last workout: ${summary}`,
      noPreviousWorkout: "No previous workout yet.",
      previousWorkout: (summary: string) => `Previous ${summary}`,
      backoff: (percent: number) => `Back-off: -${percent}%`,
      cluster: (blocks: number, repRange?: string | null) =>
        `Cluster: ${blocks} blocks${repRange ? ` (${repRange} reps)` : ""}`,
      setTechnique: (index: number, technique: string) => `Set ${index} · ${technique}`,
    },
    muscleGroups: {
      all: "All muscle groups",
      chest: "chest",
      back: "back",
      shoulders: "shoulders",
      quads: "quads",
      hamstrings: "hamstrings",
      calves: "calves",
      biceps: "biceps",
      triceps: "triceps",
    },
    techniques: {
      normal: "Normal",
      backoff: "Back-off",
      cluster: "Cluster",
      superset: "Superset",
    },
  },
  pt: {
    app: {
      loading: "Conectando ao seu espaço de treino...",
    },
    language: {
      label: "Idioma",
      english: "EN/US",
      portuguese: "PT/BR",
    },
    shell: {
      navigationLabel: "Navegação principal",
      mobileNavigationLabel: "Navegação principal no celular",
      modeLabel: "Modo",
      modeValue: "Atlético monocromático",
      nav: {
        dashboard: "Painel",
        routines: "Rotinas",
        exercises: "Exercícios",
        profile: "Perfil",
      },
    },
    landing: {
      title: "Sistema de treino para quem quer estrutura sem ruído.",
      description:
        "Monte rotinas, registre sessões e mantenha seu progresso de treino vinculado à sua conta.",
    },
    auth: {
      welcomeBack: "Bem-vindo de volta",
      createAccount: "Crie sua conta",
      email: "E-mail",
      password: "Senha",
      submitLoading: "Aguarde",
      signIn: "Entrar",
      createAccountAction: "Criar conta",
      toggleToSignUp: "Precisa de uma conta?",
      toggleToSignIn: "Já tem uma conta?",
      invalidEmail: "Digite um e-mail válido.",
      signInFailed: "Não foi possível entrar com esse e-mail e senha.",
      signUpFailed: "Não foi possível criar uma conta agora. Tente novamente.",
      accountExists: "Já existe uma conta com esse e-mail.",
      invalidPassword: "Use ao menos 8 caracteres na senha.",
      genericError: "Algo deu errado. Tente novamente.",
    },
    dashboard: {
      eyebrow: "Revisão semanal",
      title: "Sua semana de treino",
      description:
        "Revise a janela de segunda a domingo e compare conclusão semanal e progresso de carga entre suas rotinas.",
      emptyTitle: "Ainda não há rotinas",
      emptyBody: "Crie sua primeira rotina para começar a acompanhar a conclusão semanal e o progresso dos treinos.",
      emptyAction: "Ir para rotinas",
    },
    week: {
      previous: "Semana anterior",
      next: "Próxima semana",
    },
    routines: {
      eyebrow: "Biblioteca de rotinas",
      title: "Rotinas",
      description: "Crie novas rotinas aqui e depois abra uma para refinar seus exercícios e a estrutura das séries.",
      available: (count: number) => `${count} rotina${count === 1 ? "" : "s"} ${count === 1 ? "disponível" : "disponíveis"}`,
      toggleCreate: "Criar nova",
      cancel: "Cancelar",
      createLabel: "Nome da rotina",
      createPlaceholder: "Força superior",
      createAction: "Criar rotina",
      close: "Fechar",
      empty: "Ainda não há rotinas. Crie uma para começar.",
      deleteTitle: "Excluir rotina?",
      deleteDescription: (name?: string) =>
        name
          ? `Excluir ${name}? Isso vai remover a rotina e o histórico de treinos.`
          : "Isso vai remover a rotina e o histórico de treinos.",
      deleteAction: "Excluir rotina",
      backToRoutines: "Voltar para rotinas",
      editRoutine: "Editar rotina",
      viewWorkout: "Ver treino",
      logWorkout: (name: string) => `Registrar treino ${name}`,
      previousDelta: "Progressão",
      noHistory: "Sem histórico",
      deleteRoutineButton: (name: string) => `Excluir rotina ${name}`,
    },
    routineDetail: {
      eyebrow: "Editor de rotina",
      notFoundTitle: "Rotina não encontrada",
      notFoundDescription: "A rotina solicitada não existe ou foi removida.",
      titleSuffix: "construtor",
      description:
        "Monte a sessão a partir de uma base limpa e depois adicione técnicas avançadas com intenção.",
      emptyState: "Adicione um exercício para começar a estruturar esta rotina.",
      routineLabel: "Rotina",
    },
    exercises: {
      eyebrow: "Biblioteca de exercícios",
      title: "Exercícios",
      description:
        "Mantenha o catálogo compartilhado organizado para que o construtor e o fluxo de treino falem a mesma língua.",
      filterLabel: "Filtrar por grupo muscular",
      toggleCreate: "Criar exercício",
      createEyebrow: "Criar exercício",
      createTitle: "Adicione um movimento à biblioteca compartilhada",
      createDescription: "Mantenha o catálogo de movimentos organizado para que rotinas e treinos permaneçam alinhados.",
      nameLabel: "Nome do exercício",
      muscleGroupLabel: "Grupo muscular",
      descriptionLabel: "Descrição",
      createAction: "Salvar exercício",
      close: "Fechar",
      namePlaceholder: "Levantamento Terra Romeno",
      descriptionPlaceholder: "Pequena nota sobre como executar ou programar",
      allMuscleGroups: "Todos os grupos musculares",
      emptyByGroup: "Nenhum exercício corresponde a este grupo muscular.",
      emptyByFilters: "Nenhum exercício corresponde a estes filtros.",
      exerciseEyebrow: "Exercício",
      noDescription: "Ainda não há descrição.",
      cancelEditing: (name: string) => `Cancelar edição do exercício ${name}`,
      confirmChanges: (name: string) => `Confirmar alterações do exercício ${name}`,
      editExercise: (name: string) => `Editar exercício ${name}`,
      deleteExercise: (name: string) => `Excluir exercício ${name}`,
      deleteTitle: "Excluir exercício?",
      deleteDescription: (name?: string) =>
        name
          ? `Excluir ${name}? Isso vai removê-lo das suas rotinas e do histórico de treinos.`
          : "Isso vai removê-lo das suas rotinas e do histórico de treinos.",
      deleteAction: "Excluir exercício",
      cancelAction: "Cancelar",
      searchLabel: "Buscar exercícios",
      searchPlaceholder: "Buscar por nome",
      addToast: "Exercício adicionado",
      muscleGroupFilterLabel: "Filtro por grupo muscular",
      createCardTitle: "Adicione um movimento à biblioteca compartilhada",
      createCardDescription: "Mantenha o catálogo de movimentos organizado para que rotinas e treinos permaneçam alinhados.",
      createButtonLabel: "Criar exercício",
    },
    profile: {
      eyebrow: "Perfil do atleta",
      title: "Perfil",
      description:
        "Mantenha uma base clara do seu volume de treino atual e da sua capacidade semanal de carga.",
      appearance: "Aparência",
      darkMode: "Modo escuro",
      enhancedFocus: "Foco atlético aprimorado",
      maximumVisibility: "Máxima visibilidade",
      followSystemPreference: "Seguir preferência do sistema",
      auto: "Auto",
      account: "Conta",
      signOut: "Sair",
      routines: "Rotinas",
      exerciseLibrary: "Biblioteca de exercícios",
      weeklySets: "Séries semanais",
      weeklyVolume: {
        title: "Volume da semana atual",
        plannedSets: "Séries planejadas",
        status: {
          low: "Baixo",
          moderate: "Moderado",
          high: "Alto",
        },
      },
      language: "Idioma",
      gainlyAthlete: "Atleta Gainly",
      signedIn: "Conectado",
    },
    workout: {
      title: "Treino",
      noWorkout: "Nenhum treino disponível.",
      restoringEyebrow: "Sessão de treino",
      restoringTitle: "Restaurando a sessão de treino",
      restoringDescription:
        "Restaurando sua sessão de treino e trazendo os valores de séries registradas da última semana.",
      restoringBody: "Preparando sua sessão de treino...",
      description:
        "Acompanhe cada série com os valores atuais e mantenha visível o treino anterior da semana selecionada para comparação.",
      routineWorkout: (name: string) => `Treino ${name}`,
      completed: "Treino concluído.",
      activeSession: "As alterações são salvas na sessão ativa.",
      completeSession: "Concluir sessão",
      restoreError: "Não foi possível restaurar esta sessão de treino. Atualize e tente novamente.",
      saveError: "Não foi possível salvar essa série agora.",
      completeError: "Não foi possível concluir esta sessão agora.",
    },
    library: {
      addExercise: "Adicionar exercício",
      addExerciseDescription: "Escolha da biblioteca ou crie um movimento para esta rotina.",
      createNew: "Criar novo",
      collapseAdd: "Recolher adição de exercício",
      expandAdd: "Expandir adição de exercício",
      searchLabel: "Buscar exercícios",
      searchPlaceholder: "Buscar por nome",
      filterLabel: "Filtrar por grupo muscular",
      createEyebrow: "Criar exercício",
      createDescription: "Mantenha o catálogo de movimentos organizado para que rotinas e treinos permaneçam alinhados.",
      noMatches: "Nenhum exercício corresponde a estes filtros.",
      addedToast: "Exercício adicionado",
    },
    builder: {
      exerciseIndex: (index: number) => `Exercício ${index}`,
      repRange: "Faixa de reps",
      repRangeMin: "Repetições mínimas",
      repRangeMax: "Repetições máximas",
      warmupSets: "AQ",
      feederSets: "FS",
      addSet: "Adicionar série",
      addSuperset: "Adicionar Superset",
      removeExercise: "Remover exercício",
      removeSet: "Remover série",
      addTechnique: "Adicionar técnica",
      supersetInstructions: "Selecione dois exercícios diferentes para montar o superset.",
      supersetSelectFirst: "Selecione o primeiro exercício",
      supersetSelectSecond: "Selecione o segundo exercício",
      supersetCancel: "Cancelar",
      supersetSameExercise: "Escolha dois exercícios diferentes.",
      techniqueMenu: {
        backoff: "Série de descarga",
        cluster: "Série em cluster",
        superset: "Superset",
      },
      setIndex: (index: number) => `Série ${index}`,
      noDescription: "Ainda não há descrição.",
      pairedWith: (name: string) => `Pareado com ${name}`,
      pairWeight: "Peso do pareamento",
      pairReps: "Repetições do pareamento",
      weight: "Peso",
      reps: "Repetições",
      lastWorkout: (summary: string) => `Treino anterior: ${summary}`,
      noPreviousWorkout: "Ainda não há treino anterior.",
      previousWorkout: (summary: string) => `Anterior ${summary}`,
      backoff: (percent: number) => `Descarga: -${percent}%`,
      cluster: (blocks: number, repRange?: string | null) =>
        `Cluster: ${blocks} blocos${repRange ? ` (${repRange} repetições)` : ""}`,
      setTechnique: (index: number, technique: string) => `Série ${index} · ${technique}`,
    },
    muscleGroups: {
      all: "Todos os grupos musculares",
      chest: "peito",
      back: "costas",
      shoulders: "ombros",
      quads: "quadríceps",
      hamstrings: "Posterior de coxa",
      calves: "panturrilhas",
      biceps: "bíceps",
      triceps: "tríceps",
    },
    techniques: {
      normal: "Normal",
      backoff: "Descarga",
      cluster: "Cluster",
      superset: "Superset",
    },
  },
} as const;

export type Copy = (typeof translations)[Language];

export function getCopy(language: Language) {
  return translations[language];
}

export function getLocale(language: Language) {
  return language === "pt" ? "pt-BR" : "en-US";
}

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "pt";
}

export function isPortugueseLocale(locale: string | null | undefined) {
  return Boolean(locale?.toLowerCase().startsWith("pt"));
}

export function getLanguageFromBrowser() {
  if (typeof navigator === "undefined") {
    return "en" as const;
  }

  const browserLocale = navigator.language ?? navigator.languages?.[0];
  return isPortugueseLocale(browserLocale) ? "pt" : "en";
}

export function getInitialLanguage() {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(languageStorageKey);
      if (isLanguage(stored)) {
        return stored;
      }
    } catch {
      // Ignore storage access issues and fall back to browser detection.
    }
  }

  return getLanguageFromBrowser();
}

export function getMuscleGroupLabel(language: Language, muscleGroup: MuscleGroup | "all") {
  if (muscleGroup === "all") {
    return translations[language].muscleGroups.all;
  }

  return translations[language].muscleGroups[normalizeMuscleGroup(muscleGroup)];
}

export function getTechniqueLabel(language: Language, technique: TechniqueType) {
  return translations[language].techniques[technique];
}
