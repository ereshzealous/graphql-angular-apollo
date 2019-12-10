import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Author } from './model/author.model';
import { PageInfo } from './model/pageinfo.model';
import { GraphQLEnumType } from 'graphql';
import { LazyLoadEvent } from 'primeng/api/public_api';

const AUTHORS_QUERY = gql`
query{
  authors {
    id
    name
    age
    dateOfBirth
    emailId
    mobileNumber
    createdDate
  }
}
`;

const language_query = gql`
  query {
    allLanguages  {
    id
    name
  }
}
`;

const getLanguageByName = gql`
query getLanguageByName($name : String) {
  getLanguageByName(language : $name) {
    id
    name
  }
}
`;

const AUTHORS_PAGE_QUERY = gql` 
query 
   allAuthors($page : Int, $size: Int, $sortOrder : SortOrder) {
     allAuthors(page : {
       page : $page
       size : $size
       sortOrder : $sortOrder
     }) {
      totalRecords
      authors {
        id
        emailId
        name
        mobileNumber
        createdDate
        dateOfBirth
      }
    }
  }`;


@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})

export class AuthorsComponent implements OnInit {

  authors: Author[] = [];
  private query: QueryRef<any>;
  public pageInfo: PageInfo = new PageInfo();
  totalRecords: number = 0;
  columns: any[] = [];
  author : Author = new Author();
  public showAuthorDialog : Boolean = false;

  constructor(private apollo: Apollo) { }

  public loadAuthors(event: LazyLoadEvent) {
    this.pageInfo.page = event.first/event.rows;
    this.pageInfo.size = event.rows;
    this.pageInfo.sortOrder = event.sortOrder === 1 ? "ASC" : "DESC";
    this.loadAuthorsData(this.pageInfo);
  }

  ngOnInit() {
    this.columns = [
      { field: 'name', header: 'Author Name' },
      { field: 'emailId', header: 'Email Id' },
      { field: 'mobileNumber', header: 'Mobile Number' },
      { field: 'createdDate', header: 'Created Date' },
      { field: '', header: 'Actions' }
    ]
  }

  public updateAuthor(author : Author) {
    this.showAuthorDialog = true;
    this.author = author;
  }

  public loadAuthorsData(pageInfo: PageInfo) {
    this.query = this.apollo.watchQuery({
      query: AUTHORS_PAGE_QUERY,
      variables: {
        page: this.pageInfo.page,
        size: this.pageInfo.size,
        sortOrder: this.pageInfo.sortOrder
      }
    });
    this.query.valueChanges.subscribe(result => {
      this.totalRecords = result.data.allAuthors.totalRecords
      this.authors = result.data.allAuthors.authors;
    });
  }
}
