const { faker } = require('@faker-js/faker');
const fs = require('fs');

const generateUsers = (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        users.push({
            id: faker.string.uuid(),
            name: faker.person.fullName({ firstName }),
            email: faker.internet.email({ firstName }),
            username: faker.internet.username({ firstName }),
            avatar: faker.image.avatar(),
            jobTitle: faker.person.jobTitle(),
            phone: faker.phone.number(),
            address: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zipCode: faker.location.zipCode(),
                country: faker.location.country(),
            },
            // New fields from registration UI
            instanceDisplayName: `${faker.company.name()} Gateway`,
            secureBaseUrl: `https://api.${faker.internet.domainName()}`,
            masterAuthorizationKey: faker.string.alphanumeric(32),
            deploymentDescription: faker.company.catchPhrase(),
            createdAt: faker.date.past().toISOString(),
        });
    }
    return users;
};

const users = generateUsers(200);
fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
console.log('Successfully generated 200 users in users.json');
