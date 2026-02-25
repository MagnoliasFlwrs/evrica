import man from './managerIcons/Man.png'
import woman from './managerIcons/Girl.png'


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

        const maleIcons = [ man];
        const randomIndex = Math.floor(Math.random() * maleIcons.length);
        return maleIcons[randomIndex];
    } else {

        const femaleIcons = [ woman ];
        const randomIndex = Math.floor(Math.random() * femaleIcons.length);
        return femaleIcons[randomIndex];
    }
};