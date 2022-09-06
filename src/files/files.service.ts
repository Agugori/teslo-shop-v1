import { join } from 'path';
import { existsSync } from 'fs';

import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {
  
    getStaticProdImg(imgName: string) { //Verifica que el archivo exista sin importar que tipo de datos es.
        const path = join( __dirname, '../../static/products', imgName  );

        if( !existsSync(path) ) throw new BadRequestException(`El producto con la imagen: ${imgName} no fue encontrado`);

        return path;
    }
}
