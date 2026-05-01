import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { EventService } from 'src/app/core/services/event.service';
@Component({
  selector: 'app-cast-optimization-rightsidebar',
  templateUrl: './cast-optimization-rightsidebar.component.html',
  styleUrls: ['./cast-optimization-rightsidebar.component.scss'],
  standalone: false
})

/**
 * Right Sidebar component
 */
export class CastOptimizationRightsidebarComponent implements OnInit {

  attribute: any;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();
  selectedReport: string = '';
  constructor(private eventService: EventService, private offcanvasService: NgbOffcanvas, private store: Store<RootReducerState>) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() { }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
  }


}
