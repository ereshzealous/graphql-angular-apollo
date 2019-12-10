import { Author } from './author.model'

export class AuthorsResponse {
    totalRecords : number
    authors : Author[] = []
}