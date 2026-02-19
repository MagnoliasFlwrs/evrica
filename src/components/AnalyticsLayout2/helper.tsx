import queen from './managerIcons/queen-svgrepo-com.svg';
import spy from './managerIcons/spy-svgrepo-com.svg';
import waiter from './managerIcons/waiter-svgrepo-com.svg';
import woman from './managerIcons/woman-svgrepo-com.svg';
import superheroe from './managerIcons/superheroe-svgrepo-com.svg';
import girl from './managerIcons/girl-svgrepo-com.svg';
import woman2 from './managerIcons/woman-svgrepo-com2.svg';
import businesman from './managerIcons/businessman-svgrepo-com.svg';
import man from './managerIcons/man-svgrepo-com.svg';
import man2 from './managerIcons/man-svgrepo-com2.svg';


export const getGenderIcon = (fullName: string): string => {

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts.length > 1 ? nameParts[1] : nameParts[0];

    const maleNames = new Set([
        'александр', 'алексей', 'андрей', 'антон', 'артем', 'артемий',
        'борис', 'вадим', 'валентин', 'валерий', 'василий', 'виктор',
        'виталий', 'владимир', 'владислав', 'всеволод', 'вячеслав',
        'генадий', 'георгий', 'григорий', 'даниил', 'денис', 'дмитрий',
        'евгений', 'егор', 'иван', 'игорь', 'илья', 'кирилл',
        'константин', 'лев', 'леонид', 'максим', 'михаил', 'никита',
        'николай', 'олег', 'павел', 'петр', 'роман', 'руслан',
        'сергей', 'станислав', 'степан', 'тимур', 'федор', 'юрий',
        'ян', 'ярослав'
    ]);

    const normalizedFirstName = firstName.toLowerCase();

    const isMale = maleNames.has(normalizedFirstName);

    if (isMale) {

        // const maleIcons = [spy, waiter, businesman, man, man2];
        const maleIcons = [ man];
        const randomIndex = Math.floor(Math.random() * maleIcons.length);
        return maleIcons[randomIndex];
    } else {

        // const femaleIcons = [queen, woman , superheroe, woman2, girl];
        const femaleIcons = [ woman ];
        const randomIndex = Math.floor(Math.random() * femaleIcons.length);
        return femaleIcons[randomIndex];
    }
};