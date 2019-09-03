import {Pipe, PipeTransform} from '@angular/core';
import {UserInfo} from "./interfaces";

@Pipe({
  name: 'searchUsers'
})
export class SearchPipe implements PipeTransform {
  transform(users: UserInfo[], search = ''): UserInfo[] {
    if(!search.trim()) {
      return users
    }
    const login =  users.filter(user => user.login.toLocaleLowerCase().includes(search.toLowerCase()))
    const name =  users.filter(user => user.name.toLocaleLowerCase().includes(search.toLowerCase()))
    const email =  users.filter(user => user.email.toLocaleLowerCase().includes(search.toLowerCase()))
    const filteredUsers = [...new Set([...login, ...name, ...email])]
    return filteredUsers
  }
}
