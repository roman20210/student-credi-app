import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import { HomeComponent } from './app/pages/home/home.component';

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(HomeComponent, appConfig)
    .catch(err => console.error(err));
});