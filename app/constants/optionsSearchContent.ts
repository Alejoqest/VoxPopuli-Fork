export type BtnChip = {
    optionValue: string;
    optionText: string;
};

export const stateContent: BtnChip[] = [{
    optionValue: 'all',
    optionText: 'Todos',
},
{
    optionValue: 'waiting',
    optionText: 'Espera',
},
{
    optionValue: 'active',
    optionText: 'Activo',
},
{
    optionValue: 'closed',
    optionText: 'Terminado'
}]

export const orderContent : BtnChip[] = [{
    optionValue: "",
    optionText: "Nuevos"
},{
    optionValue: "old",
    optionText: "Viejos"
}]