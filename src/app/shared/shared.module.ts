import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Counter
import { CountUpModule } from 'ngx-countup';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ClientLogoComponent } from './landing/index/client-logo/client-logo.component';
import { ServicesComponent } from './landing/index/services/services.component';
import { CollectionComponent } from './landing/index/collection/collection.component';
import { CtaComponent } from './landing/index/cta/cta.component';
import { DesignedComponent } from './landing/index/designed/designed.component';
import { PlanComponent } from './landing/index/plan/plan.component';
import { FaqsComponent } from './landing/index/faqs/faqs.component';
import { ReviewComponent } from './landing/index/review/review.component';
import { CounterComponent } from './landing/index/counter/counter.component';
import { WorkProcessComponent } from './landing/index/work-process/work-process.component';
import { TeamComponent } from './landing/index/team/team.component';
import { ContactComponent } from './landing/index/contact/contact.component';
import { FooterComponent } from './landing/index/footer/footer.component';
import { ScrollspyDirective } from './scrollspy.directive';
import { LandingScrollspyDirective } from './landingscrollspy.directive';

// NFT Landing 
import { MarketPlaceComponent } from './landing/nft/market-place/market-place.component';
import { WalletComponent } from './landing/nft/wallet/wallet.component';
import { FeaturesComponent } from './landing/nft/features/features.component';
import { CategoriesComponent } from './landing/nft/categories/categories.component';
import { DiscoverComponent } from './landing/nft/discover/discover.component';
import { TopCreatorComponent } from './landing/nft/top-creator/top-creator.component';

// Job Landing 
import { ProcessComponent } from './landing/job/process/process.component';
import { FindjobsComponent } from './landing/job/findjobs/findjobs.component';
import { CandidatesComponent } from './landing/job/candidates/candidates.component';
import { BlogComponent } from './landing/job/blog/blog.component';
import { JobcategoriesComponent } from './landing/job/jobcategories/jobcategories.component';
import { JobFooterComponent } from './landing/job/job-footer/job-footer.component';
import { AuthAlertPopupComponent } from './auth-alert-popup/auth-alert-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { CompareCardsPopupComponent } from './compare-analysis/compare-cards-poup/compare-cards-popup.component';
import { CompareAnalysisComponent } from './compare-analysis/compare-analysis.component';
import { ComparePopupComponent } from './compare-analysis/compare-popup/compare-popup.component';
import { CompareServicesPopupComponent } from './compare-analysis/compare-services-popup/compare-service.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    ClientLogoComponent,
    ServicesComponent,
    CollectionComponent,
    CtaComponent,
    DesignedComponent,
    PlanComponent,
    FaqsComponent,
    ReviewComponent,
    CounterComponent,
    WorkProcessComponent,
    TeamComponent,
    ContactComponent,
    FooterComponent,
    MarketPlaceComponent,
    WalletComponent,
    FeaturesComponent,
    CategoriesComponent,
    DiscoverComponent,
    TopCreatorComponent,
    ProcessComponent,
    FindjobsComponent,
    CandidatesComponent,
    BlogComponent,
    JobcategoriesComponent,
    JobFooterComponent,
    ScrollspyDirective,
    LandingScrollspyDirective,
    AuthAlertPopupComponent,
    AlertPopupComponent,
    ComparePopupComponent,
    CompareCardsPopupComponent,
    CompareAnalysisComponent,
    CompareServicesPopupComponent,
    ConfirmationPopupComponent


  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,
    CountUpModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
      MatFormFieldModule,
    MatInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [BreadcrumbsComponent, ClientLogoComponent, ServicesComponent, CollectionComponent, CtaComponent, DesignedComponent, PlanComponent, FaqsComponent, ReviewComponent, CounterComponent, WorkProcessComponent, TeamComponent, ContactComponent, FooterComponent,
    WalletComponent, MarketPlaceComponent, FeaturesComponent, CategoriesComponent, DiscoverComponent, TopCreatorComponent, ScrollspyDirective,
    LandingScrollspyDirective, ProcessComponent, FindjobsComponent, CandidatesComponent, BlogComponent, JobcategoriesComponent, JobFooterComponent, ConfirmationPopupComponent]
})
export class SharedModule { }
