import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { getSidebarSize } from 'src/app/store/layouts/layout-selector';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
  standalone: false
})
export class VerticalComponent implements OnInit, AfterViewChecked {

  isCondensed = false;
  getsize: any;

  constructor(private eventService: EventService, private router: Router, private activatedRoute: ActivatedRoute, private store: Store<RootReducerState>) {
  }

  //   ngOnInit(): void {

  //     const applyClass = (data: any) => {
  //       const body = document.body;

  //       // remove only page-* classes
  //       Array.from(body.classList).forEach(cls => {
  //         if (cls.startsWith('page-')) {
  //           body.classList.remove(cls);
  //         }
  //       });

  //       // add new class
  //       if (data && data['bodyClass']) {
  //         body.classList.add('page-' + data['bodyClass']);
  //       }
  //     };

  //     // ✅ 1) Apply on first load (refresh)
  //     let route = this.activatedRoute;
  //     while (route.firstChild) route = route.firstChild;
  //     applyClass(route.snapshot.data);

  //     // ✅ 2) Apply on every menu click / navigation
  //     this.router.events
  //       .pipe(
  //         filter(event => event instanceof NavigationEnd),
  //         map(() => this.activatedRoute),
  //         map(route => {
  //           while (route.firstChild) {
  //             route = route.firstChild;
  //           }
  //           return route;
  //         }),
  //         mergeMap(route => route.data)
  //       )
  //       .subscribe(data => applyClass(data));




  //     this.router.events.subscribe((event: any) => {
  //     if (document.documentElement.getAttribute('data-preloader') == 'enable') {
  //       if (event instanceof NavigationEnd) {
  //         // Update the attribute state based on the current route or any other conditions
  //         if (event.url !== '/disabled-route') {
  //           (document.getElementById("preloader") as HTMLElement).style.opacity = "1";
  //           (document.getElementById("preloader") as HTMLElement).style.visibility = "";
  //           setTimeout(() => {
  //             (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
  //             (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
  //           }, 1000);
  //         } else {
  //           (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
  //           (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
  //         }
  //       }
  //     }
  //   });

  // this.handlePreloader(this.activatedRoute.snapshot.routeConfig?.path);
  // if (document.documentElement.getAttribute('data-sidebar-size') == 'lg') {
  //   this.store.select(getSidebarSize).subscribe((size) => {
  //     this.getsize = size
  //   })
  //   window.addEventListener('resize', () => {
  //     var self = this;
  //     if (document.documentElement.clientWidth <= 767) {
  //       document.documentElement.setAttribute('data-sidebar-size', '');
  //       document.querySelector('.hamburger-icon')?.classList.add('open')
  //     }
  //     else if (document.documentElement.clientWidth <= 1024) {
  //       document.documentElement.setAttribute('data-sidebar-size', 'sm');
  //       document.querySelector('.hamburger-icon')?.classList.add('open')
  //     }
  //     else if (document.documentElement.clientWidth >= 1024) {
  //       if (document.documentElement.getAttribute('data-layout-width') == 'fluid') {
  //         document.documentElement.setAttribute('data-sidebar-size', self.getsize);
  //         document.querySelector('.hamburger-icon')?.classList.remove('open')
  //       }
  //     }
  //   })
  // }
  //   }
  ngOnInit(): void {

    // ✅ Close sidebar on initial load
    document.documentElement.setAttribute('data-sidebar-size', 'sm');
    this.isCondensed = true;

    const applyClass = (data: any) => {
      const body = document.body;

      // remove only page-* classes
      Array.from(body.classList).forEach((cls: string) => {
        if (cls.startsWith('page-')) {
          body.classList.remove(cls);
        }
      });

      // add new class
      if (data && data['bodyClass']) {
        body.classList.add('page-' + data['bodyClass']);
      }
    };

    // ✅ Apply on first load (refresh)
    let route = this.activatedRoute;
    while (route.firstChild) route = route.firstChild;
    applyClass(route.snapshot.data);

    // ✅ Apply on every navigation
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route: any) => route.data)
      )
      .subscribe((data: any) => applyClass(data));

    // ✅ Preloader on route change
    this.router.events.subscribe((event: any) => {
      if (document.documentElement.getAttribute('data-preloader') == 'enable') {
        if (event instanceof NavigationEnd) {

          if (event.url !== '/disabled-route') {
            (document.getElementById("preloader") as HTMLElement).style.opacity = "1";
            (document.getElementById("preloader") as HTMLElement).style.visibility = "";

            setTimeout(() => {
              (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
              (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
            }, 1000);

          } else {
            (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
            (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
          }
        }
      }
    });

    // Initial preloader call
    this.handlePreloader(this.activatedRoute.snapshot.routeConfig?.path);

    // Sidebar resize handling
    if (document.documentElement.getAttribute('data-sidebar-size') == 'lg') {

      this.store.select(getSidebarSize).subscribe((size: any) => {
        this.getsize = size;
      });

      window.addEventListener('resize', () => {
        var self = this;

        if (document.documentElement.clientWidth <= 767) {
          document.documentElement.setAttribute('data-sidebar-size', '');
          document.querySelector('.hamburger-icon')?.classList.add('open');
        }

        else if (document.documentElement.clientWidth <= 1024) {
          document.documentElement.setAttribute('data-sidebar-size', 'sm');
          document.querySelector('.hamburger-icon')?.classList.add('open');
        }

        else if (document.documentElement.clientWidth >= 1024) {
          if (document.documentElement.getAttribute('data-layout-width') == 'fluid') {
            document.documentElement.setAttribute('data-sidebar-size', self.getsize);
            document.querySelector('.hamburger-icon')?.classList.remove('open');
          }
        }

      });
    }

    // Initial footer position check
    setTimeout(() => {
      this.updateFooterPosition();
    }, 500);
  }

  ngAfterViewChecked() {
    this.updateFooterPosition();
  }

  updateFooterPosition() {
    const placeholder = document.querySelector('.simplebar-placeholder') as HTMLElement;
    const content = document.querySelector('.page-content') as HTMLElement;
    const footer = document.querySelector('.footer') as HTMLElement;

    if (placeholder && content && footer) {
      const placeholderHeight = placeholder.offsetHeight;
      const contentHeight = content.offsetHeight;

      if (contentHeight < placeholderHeight) {
        footer.style.position = 'fixed';
        // footer.style.bottom = '0';
      } else {
        footer.style.position = 'absolute';
      }
    }
  }

  private handlePreloader(route: any) {
    if (route !== '/disabled-route') {
      (document.getElementById("preloader") as HTMLElement).style.opacity = "1";
      (document.getElementById("preloader") as HTMLElement).style.visibility = "";
      setTimeout(() => {
        (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
        (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
      }, 1000);
    } else {
      (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
      (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
    }
  }


  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    const currentSIdebarSize = document.documentElement.getAttribute("data-sidebar-size");
    if (document.documentElement.clientWidth >= 767) {
      if (currentSIdebarSize == null) {
        (document.documentElement.getAttribute('data-sidebar-size') == null || document.documentElement.getAttribute('data-sidebar-size') == "lg") ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg')
      } else if (currentSIdebarSize == "md") {
        (document.documentElement.getAttribute('data-sidebar-size') == "md") ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'md')
      } else {
        (document.documentElement.getAttribute('data-sidebar-size') == "sm") ? document.documentElement.setAttribute('data-sidebar-size', 'lg') : document.documentElement.setAttribute('data-sidebar-size', 'sm')
      }
    }

    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle('vertical-sidebar-enable');
    }
    this.isCondensed = !this.isCondensed;
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");

    }
  }

  onResize(event: any) {
    if (document.body.getAttribute('layout') == "twocolumn") {
      if (event.target.innerWidth <= 767) {
        this.eventService.broadcast('changeLayout', 'vertical');
      } else {
        this.eventService.broadcast('changeLayout', 'twocolumn');
        document.body.classList.remove('twocolumn-panel');
        document.body.classList.remove('vertical-sidebar-enable');
      }
    }
    this.updateFooterPosition();
  }


}
