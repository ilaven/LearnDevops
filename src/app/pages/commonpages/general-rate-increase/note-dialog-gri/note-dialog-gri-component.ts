import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  Inject,
  ChangeDetectorRef,
  AfterViewInit,
  signal
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { finalize } from "rxjs";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: 'app-note-dialog-gri',
  templateUrl: './note-dialog-gri-component.html',
  styleUrls: ['./note-dialog-gri-component.scss'],
  standalone:false
})
export class NoteDialogGRIComponent implements AfterViewInit {

  noteText: string = '';
  isSaving: boolean = false;
   isLoading :any= signal<any>(false); 

  @ViewChild('editorBox') editorBox!: ElementRef<HTMLDivElement>;

  constructor(
    public dialogRef: MatDialogRef<NoteDialogGRIComponent>,
    private loaderService: LoaderService,
    private httpClientService: HttpClientService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadExistingNote();
  }

  ngAfterViewInit(): void {
    if (this.noteText) {
      this.injectNoteText();
    }
  }

  // ✅ Load existing note
  private loadExistingNote(): void {
    const carrierType = this.data.carrierDetails?.carrierName || this.data.carrierDetails?.carrierType;
    const clientName = this.data.carrierDetails?.clientName;
    let targetId = this.data.target?.targetId || '';
    let clientId = this.data.clientId;

    if (!carrierType || !clientName) return;

    // 🔥 Fix NG0100 issue
     this.isLoading.set(true);
    this.cdr.detectChanges();
    // this.loaderService.show();

    this.httpClientService
      .fetchCustomerNoteByCarrierType(carrierType, clientName, targetId, clientId)
      .pipe(
        finalize(() => {
         this.isLoading.set(false);
          this.cdr.detectChanges();
          // this.loaderService.hide();
        })
      )
      .subscribe({
        next: (note) => {
          this.noteText = note || '';
          setTimeout(() => this.injectNoteText(), 0);
        },
        error: (err) => {
          console.error('Failed to load note:', err);
          this.noteText = '';
        }
      });
  }

  // ✅ Inject content into editor
  private injectNoteText(): void {
    const cleaned = this.cleanHTMLDirection(this.noteText);
    this.renderer.setProperty(this.editorBox.nativeElement, 'innerHTML', cleaned);
  }

  // ✅ Save note
  saveNote(): void {
    if (!this.noteText?.trim()) return;

    this.isSaving = true;

    const carrierType = this.data.carrierDetails?.carrierName || this.data.carrierDetails?.carrierType;
    const clientName = this.data.carrierDetails?.clientName;
    let targetId = this.data.target?.targetId || '';
    let clientId = this.data.clientId;

    if (!carrierType || !clientName) {
      this.isSaving = false;
      return;
    }

    const cleanText = this.cleanHTMLDirection(this.noteText.trim());

    this.httpClientService
      .updateCustomerNotesByCarrierType(carrierType, clientName, cleanText, targetId, clientId)
      .subscribe({
        next: () => {
          this.dialogRef.close({ saved: true, note: cleanText });
        },
        error: () => {
          this.isSaving = false;
        },
        complete: () => {
          this.isSaving = false;
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close({ saved: false });
  }

  // ✅ Formatting
  private exec(cmd: string) {
    document.execCommand(cmd, false);
  }

  format(cmd: string) {
    this.exec(cmd);
  }

  // ✅ Clean RTL issues
  cleanHTMLDirection(html: string): string {
    if (!html) return '';

    return html
      .replace(/[\u202E\u202B\u202A\u202D\u202C]/g, '')
      .replace(/dir=["']rtl["']/gi, '')
      .replace(/style=["']?[^"']*(direction|unicode-bidi):\s*rtl;?[^"']*["']?/gi, '')
      .replace(/<[^>]+dir=["']rtl["'][^>]*>/gi, match =>
        match.replace(/dir=["']rtl["']/gi, '')
      )
      .replace(/<span[^>]*style=["'][^"']*direction:\s*rtl;?[^"']*["'][^>]*>/gi, '<span>');
  }

  // ✅ Capture editor changes
  onTextChange(event: any) {
    const rawHtml = event.target.innerHTML;
    this.noteText = this.cleanHTMLDirection(rawHtml.trim());
  }
}