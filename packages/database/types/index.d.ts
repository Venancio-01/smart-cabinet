declare namespace NodeJS {
  interface Process {
    resourcesPath: string
  }
}

export type PaginationType = {
  page: number
  size: number
}
