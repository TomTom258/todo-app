import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    const initialTasks = this.loadTasks();
    this.tasksSubject = new BehaviorSubject<Task[]>(initialTasks);
    this.tasks$ = this.tasksSubject.asObservable();
  }

  private loadTasks(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  public addTask(task: Task): void {
    const tasks = [...this.tasksSubject.value, task];
    this.tasksSubject.next(tasks);
    this.saveTasks(tasks);
  }

  public deleteTask(id: string): void {
    const tasks = this.tasksSubject.value.filter(task => task?.id !== id);
    this.tasksSubject?.next(tasks);
    this.saveTasks(tasks);
  }

  public toggleCompletion(id: string): void {
    const tasks = this.tasksSubject.value.map(task =>
      task?.id === id ? { ...task, completed: !task?.completed } : task
    );
    this.tasksSubject.next(tasks);
    this.saveTasks(tasks);
  }
}
