import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/TaskService';

@Component({
  selector: 'task-component',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  public newTaskTitle = '';
  public tasks$: Observable<Task[]> = this.taskService.tasks$;

  constructor(private taskService: TaskService) { }

  public get todoTasks$(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => !task?.completed))
    );
  }

  public get completedTasks$(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task?.completed))
    );
  }

  public addTask(): void {
    const newTask: Task = {
      id: this.generateId(),
      title: this.newTaskTitle,
      completed: false
    };
    this.taskService.addTask(newTask);
    // clear before next use
    this.newTaskTitle = '';
  }

  public deleteTask(id: string): void {
    this.taskService.deleteTask(id);
  }

  public toggleCompletion(id: string): void {
    this.taskService.toggleCompletion(id);
  }

  private generateId(): string {
    return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
  }
}
