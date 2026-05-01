import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core'; 
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  isLoading = signal<any>(false);
  constructor(private loaderService: LoaderService) {}
  ngOnInit(): void {
    this.loaderService.loaderState$.subscribe((state:any) => { 
      this.isLoading.set(state);
    });
  }

}