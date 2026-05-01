import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: "[formControlName][phoneMask]",
    standalone: true // ✅ Angular 15+ → recommended in 16+
})
export class PhoneMaskDirective {
    constructor(public ngControl: NgControl) { }

    @HostListener("input", ["$event"])
    onKeyDown(event: Event): void {
        const input = event.target as HTMLInputElement;

        let trimmed: string = input.value.replace(/\s+/g, "");

        if (trimmed.length > 12) {
            trimmed = trimmed.substring(0, 12);
        }

        trimmed = trimmed.replace(/-/g, "");

        const numbers: string[] = [];
        numbers.push(trimmed.substring(0, 3));
        if (trimmed.substring(3, 3) !== "") numbers.push(trimmed.substring(3, 6));
        if (trimmed.substring(6, 4) !== "") numbers.push(trimmed.substring(6, 10));

        input.value = numbers.join("-");
    }
}