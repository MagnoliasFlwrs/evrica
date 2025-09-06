import React from 'react';
import styles from './PageTitle.module.scss';

const PageTitle = ({ text }: { text: string }) => {
    return (
        <h1 className={styles.PageTitle}>{text}</h1>
    );
};

export default PageTitle;