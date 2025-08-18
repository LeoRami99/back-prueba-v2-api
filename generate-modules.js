const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
    console.error('❌ Please provide a module name:');
    console.error('   Usage: node generate-module.js course');
    process.exit(1);
}

const pascalCase = str => str[0].toUpperCase() + str.slice(1);
const kebabCase = str =>
    str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const basePath = path.join(__dirname, 'src', 'modules', moduleName);

const folders = [
    'application/use-cases',
    'domain/entities',
    'domain/repositories',
    'infrastructure/database',
    'interface/controllers',
];

const ensureFolder = folder => {
    const fullPath = path.join(basePath, folder);
    fs.mkdirSync(fullPath, { recursive: true });
};

const writeFile = (relPath, content) => {
    const fullPath = path.join(basePath, relPath);
    fs.writeFileSync(fullPath, content, { flag: 'wx' });
};

const moduleClass = `${pascalCase(moduleName)}Module`;
const moduleFile = `${moduleName}.module.ts`;

// Create folders
folders.forEach(ensureFolder);

// Create sample use case
writeFile(
    'application/use-cases/create-' + moduleName + '.use-case.ts',
    `import { Injectable } from '@nestjs/common';

@Injectable()
export class Create${pascalCase(moduleName)}UseCase {
  async execute(data: any): Promise<any> {
    return { message: '${moduleName} created!', data };
  }
}
`
);

// Create entity
writeFile(
    'domain/entities/' + moduleName + '.entity.ts',
    `export class ${pascalCase(moduleName)}Entity {
  constructor(public readonly id: number, public name: string) {}
}
`
);

// Create repository interface
writeFile(
    'domain/repositories/' + moduleName + '.repository.ts',
    `import { ${pascalCase(moduleName)}Entity } from '../entities/${moduleName}.entity';

export abstract class ${pascalCase(moduleName)}Repository {
  abstract create(data: Partial<${pascalCase(moduleName)}Entity>): Promise<${pascalCase(moduleName)}Entity>;
}
`
);

// Create controller
writeFile(
    'interface/controllers/' + moduleName + '.controller.ts',
    `import { Controller, Post, Body } from '@nestjs/common';
import { Create${pascalCase(moduleName)}UseCase } from '../../application/use-cases/create-${moduleName}.use-case';

@Controller('${kebabCase(moduleName)}s')
export class ${pascalCase(moduleName)}Controller {
  constructor(private readonly createUseCase: Create${pascalCase(moduleName)}UseCase) {}

  @Post()
  async create(@Body() body: any) {
    return this.createUseCase.execute(body);
  }
}
`
);

// Create module file
writeFile(
    moduleFile,
    `import { Module } from '@nestjs/common';
import { ${pascalCase(moduleName)}Controller } from './interface/controllers/${moduleName}.controller';
import { Create${pascalCase(moduleName)}UseCase } from './application/use-cases/create-${moduleName}.use-case';

@Module({
  controllers: [${pascalCase(moduleName)}Controller],
  providers: [Create${pascalCase(moduleName)}UseCase],
})
export class ${moduleClass} {}
`
);

console.log(`✅ ${pascalCase(moduleName)} module generated at src/modules/${moduleName}`);