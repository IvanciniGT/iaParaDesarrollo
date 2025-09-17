import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './config/app.config';
import { AppComponent } from './components/app.component/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
