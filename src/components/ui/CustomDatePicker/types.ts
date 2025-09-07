export interface CustomDatePickerProps {
    openCustomDatePicker: boolean;
    setOpenCustomDatePicker: (open: boolean) => void;
    selectedDate?: Value;
    onDateChange?: (date: Value) => void;
}
export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];