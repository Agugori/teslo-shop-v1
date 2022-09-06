

export const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function ) => {

    // console.log(file);
    if(!file) return cb( new Error('El Archivo esta vacio'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'jpeg', 'png', 'gif'];
    if( validExtension.includes( fileExtension ) ) {
        return cb(null, true)
    }

    cb(null, false);

}