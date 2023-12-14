declare namespace NodeJS {
  interface Process {
    resourcesPath: string
  }
}

export interface PaginationType {
  page: number
  size: number
}
