import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TabsComponent } from './tabs/tabs.component';
import { MaterialsModule } from './materials/materials.module';
import { InstrumentListComponent } from './instrument-list/instrument-list.component';
import { PixelBoardService } from './pixel-board.service';
import { HttpModule } from '@angular/http';
import { InstrumentComponent } from './instrument/instrument.component';
import { LiveSceneComponent } from './live-scene/live-scene.component';
import { MatColorPickerModule } from 'mat-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InstrumentConfigComponent } from './instrument-config/instrument-config.component';
import { SceneConfigComponent } from './scene-config/scene-config.component';
import { EditInstrumentComponent } from './edit-instrument/edit-instrument.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditSceneDialogComponent } from './edit-scene-dialog/edit-scene-dialog.component';
import { SelectSceneDialogComponent } from './select-scene-dialog/select-scene-dialog.component';
import { ShowComponent } from './show/show.component';
import { EditShowDialogComponent } from './edit-show-dialog/edit-show-dialog.component';
import { ShowConfigComponent } from './show-config/show-config.component';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    InstrumentListComponent,
    InstrumentComponent,
    LiveSceneComponent,
    InstrumentConfigComponent,
    SceneConfigComponent,
    ShowConfigComponent,
    EditInstrumentComponent,
    ConfirmDialogComponent,
    EditSceneDialogComponent,
    SelectSceneDialogComponent,
    EditShowDialogComponent,
    ShowComponent
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
  bootstrap: [AppComponent],
  entryComponents: [
    EditInstrumentComponent,
    ConfirmDialogComponent,
    EditSceneDialogComponent,
    EditShowDialogComponent,
    SelectSceneDialogComponent
   ]
})
export class AppModule { }
