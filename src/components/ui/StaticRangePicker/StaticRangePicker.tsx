import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import React from 'react';
import styles from './StaticRangePicker.module.scss';

const { RangePicker } = DatePicker;

interface StaticRangePickerProps extends RangePickerProps {}

const StaticRangePicker: React.FC<StaticRangePickerProps> = ({
  value,
  onChange,
  format = 'DD/MM/YY',
  separator,
  className,
  popupClassName,
  ...props
}) => {
  return (
    <div className={styles.staticWrapper}>
      <RangePicker
        value={value}
        onChange={onChange}
        format={format}
        separator={separator}
        suffixIcon={null}
        allowClear={false}
        open={true}
        getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
        className={`${styles.hiddenInput} ${className || ''}`}
        popupClassName={`${styles.cleanPopup} ${popupClassName || ''}`}
        {...props}
      />
    </div>
  );
};

export default StaticRangePicker;
