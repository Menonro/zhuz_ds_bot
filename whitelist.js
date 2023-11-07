import fs from 'fs';

const fileToWatch =  './whitelist.json'

let list = {}
updateList();
fs.watch(fileToWatch, updateList);

function updateList () {
    console.log('Список обновлён');
    list = fs.readFileSync(fileToWatch).toString()
    list = JSON.parse(list);
}

export function getWhitelist() {
    return list
}

export function filter(msg) {
    if (!Object.values(list.admin).includes(msg.author.id)) {
        if (!Object.values(list.whitelist.servers).includes(msg.guild.id + '')) {
            return [false, 'Сервер не обслуживается'];
        } else if (Object.values(list.blacklist.users).includes(msg.author.id + '')) {
            return [false, 'Вы в чёрном списке'];
        }
    }
    return [true, 'OK'];
}