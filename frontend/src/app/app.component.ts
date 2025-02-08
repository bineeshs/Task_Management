// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   template: `
//     <div class="app-container">
//       <router-outlet></router-outlet>
//     </div>
//   `,
//   styles: [`
//     .app-container {
//       min-height: 100vh;
//       background-color: #f5f5f5;
//     }
//   `]
// })
// export class AppComponent {
//   title = 'task-manager';
  
// }



import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !(event.url === '/login' || event.url === '/register');
      }
    });
  }
}

