export class User {
    constructor(
        public username: string,
        public password: string,
        public dateCreated: Date,
        public dateModified?: Date,
        public description?: string,
        public url?: string,
        public likes?: Number,
        public posts?: string[],
        public favoriteUsers?: string[],
        public favoritePosts?: string[]        
    ) {}
}
