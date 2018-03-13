class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {
            id : id,
            name : name,
            room: room
        }
        this.users.push(user);

        return user;
    }

    getUser(id) {
        var user = this.users.filter((user) => {
            return user.id === id;
        })[0];

        return user;
    }

    removeUser(id) {
        var user = this.getUser(id);
        this.users = this.users.filter((user) => {
            return user.id !== id;
        });

        return user;
    }

    
    getUserList(room) {
        var userArray = [];
        userArray = this.users.filter((user) => {
            return user.room === room;
        });
        var nameArray = [];
        nameArray = userArray.map((user) => {
            return user.name;
        });

        return nameArray;
    }
}

module.exports = Users;