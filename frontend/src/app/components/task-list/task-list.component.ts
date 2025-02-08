import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: any = { title: '', description: '', completed: false, created_date: '' };
  showAddTaskForm = false;
  editingTask: Task | null = null;
  currentPage = 1;
  hasNextPage = false;
  statusFilter = '';
  sortBy = '-created_date';

  constructor(private taskService: TaskService,private authService: AuthService,
      private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  logout() {
    localStorage.removeItem('token');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  loadTasks(): void {
    this.taskService.getTasks(this.currentPage, this.statusFilter, this.sortBy)
      .subscribe(response => {
        this.tasks = response.results;
        this.hasNextPage = !!response.next;
      });
  }

  saveTask(): void {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id!, this.newTask)
        .subscribe(() => {
          this.editingTask = null;
          this.newTask = { title: '', description: '', completed: false, created_date: '' };
          this.loadTasks();
        });
    } else {
      this.taskService.createTask(this.newTask)
        .subscribe(() => {
          this.newTask = { title: '', description: '', completed: false, created_date: '' };
          this.loadTasks();
        });
    }
    this.showAddTaskForm = false;
  }

  changePage(page: number): void {
    if (page < 1) return;
    this.currentPage = page;
    this.loadTasks();
  }

  toggleTaskStatus(task: Task): void {
    if (task.id === undefined) return; 
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id, updatedTask)
      .subscribe(() => {
        task.completed = updatedTask.completed;
      });
  }
  
  deleteTask(id: number | undefined): void {
    if (id === undefined) return; 
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id)
        .subscribe(() => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        });
    }
  }
  

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.newTask = { ...task };
    this.showAddTaskForm = true;
  }

  cancelEdit(): void {
    this.editingTask = null;
    this.newTask = { title: '', description: '', completed: false, created_date: '' };
    this.showAddTaskForm = false;
  }
}
