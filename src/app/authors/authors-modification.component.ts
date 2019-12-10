import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Author } from './model/author.model';
import { AuthorsComponent } from './authors.component';
import gql from 'graphql-tag';

const AUTHORS_UPDATE = gql`
mutation 
    saveAuthor($id : String!, $name: String!, $emailId : String!, $mobileNumber: String!, $dateOfBirth: LocalDate!) {
        saveAuthor(author : {
            id : $id
            name : $name
            emailId : $emailId
            mobileNumber : $mobileNumber 
            dateOfBirth: $dateOfBirth
        }) {
        id
        emailId
        name
        mobileNumber
        createdDate
        dateOfBirth
        }
    }`;

@Component({
    selector: 'modify-authors',
    templateUrl: './authors-modification.html',
    styleUrls: ['./authors.component.css']
})



export class AuthorModificationComponent implements OnInit {

    public author : Author = new Author();
    private query: QueryRef<any>;

    constructor(public authorsComponent : AuthorsComponent, private apollo: Apollo) {
        
    }
    
    ngOnInit() {
        this.author = this.authorsComponent.author;
    }

    public cancelAuthorUpdate() {
        this.authorsComponent.showAuthorDialog = false;
    }

    public updateAuthor() {
        this.apollo.mutate({
            mutation: AUTHORS_UPDATE,
            variables: {
              id : this.author.id,
              name : this.author.name,
              emailId : this.author.emailId,
              mobileNumber : this.author.mobileNumber,
              dateOfBirth : this.author.dateOfBirth
            }
          }).subscribe((response) => {
                  this.authorsComponent.showAuthorDialog = false;
          });
    }

}