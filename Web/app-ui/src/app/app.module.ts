import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TabsComponent } from './tabs/tabs.component';
import { MaterialsModule } from './materials/materials.module';
import { InstrumentListComponent } from './instrument-list/instrument-list.component'
import { PixelBoardService } from './pixel-board.service'
import { HttpModule } from '@angular/http';
import { InstrumentComponent } from './instrument/instrument.component';
import { LiveSceneComponent } from './live-scene/live-scene.component';
import { MatColorPickerModule } from 'mat-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    InstrumentListComponent,
    InstrumentComponent,
    LiveSceneComponent
  ],
  imports: [
    BrowserModule,
    MaterialsModule,
    HttpModule,
    FormsModule,
    MatColorPickerModule,
    BrowserAnimationsModule
  ],
  providers: [PixelBoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
