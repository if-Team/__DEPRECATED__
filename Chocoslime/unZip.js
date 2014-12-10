/* Do not operate if the directory exists */

function unZip(zip,unzip) 
{
    try
    {
        var zis = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zip));
        var entry;
        while((entry = zis.getNextEntry())!=null) 
        {
            var fos = new java.io.FileOutputStream(unzip + entry.getName());
            var buf = new java.nio.ByteBuffer.allocate(1024).array();
            var len;
            while((len = zis.read(buf))>0)
            {
                fos.write(buf,0,len);
                var file = new java.io.File(unzip);
                file.getParentFile().mkdirs()
            
            }
            zis.closeEntry();
            fos.close();
        }
        zis.close();
    }
    catch(err)
    {
        print(err);
    }
}
