import { Component, OnInit } from '@angular/core';
import { PixelBoardService } from '../pixel-board.service';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  public displayedColumns = ['sortOrder', 'name', 'edit', 'delete'];

  constructor(private _service: PixelBoardService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

}
