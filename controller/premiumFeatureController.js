const UserDb = require("../model/userDb");
const Expense = require("../model/expenseDb");
const { Sequelize } = require('sequelize');

exports.leaderboard = async (req, res) => {
    try {
        const leaderBoard = await UserDb.findAll({
            attributes: ['name','totalExpense' ],
            order: [['totalExpense', 'DESC']]
        });

        res.status(200).json(leaderBoard);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};


    exports.report = async (req, res) => {
        const user = req.user; // Assuming req.user contains the authenticated user
        const year = req.query.year;
       
    
        
    
        try {
            const userExpenses = await user.getExpenses({
                where: {
                    date: {
                        [Sequelize.Op.between]: [new Date(`${year}-01-01`), new Date(`${year}-12-31`)],
                    },
                },
            });
    
            if (userExpenses) {
                res.status(200).json(userExpenses);
            }
        } catch (error) {
            console.error("Error retrieving expenses:", error);
            res.status(500).json({ success: false, error: error });
        }
    };

   
    

    // const downloadExpenses =  async (req, res) => {

    //     try {
    //         if(!req.user.ispremiumuser){
    //             return res.status(401).json({ success: false, message: 'User is not a premium User'})
    //         }
    //         const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
    //         // Create the BlobServiceClient object which will be used to create a container client
    //         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    
    //         // V.V.V.Imp - Guys Create a unique name for the container
    //         // Name them your "mailidexpensetracker" as there are other people also using the same storage
    
    //         const containerName = 'prasadyash549yahooexpensetracker'; //this needs to be unique name
    
            
    //         // Get a reference to a container
    //         const containerClient = await blobServiceClient.getContainerClient(containerName);
    
    //         //check whether the container already exists or not
    //         if(!containerClient.exists()){
    //             // Create the container if the container doesnt exist
    //             const createContainerResponse = await containerClient.create({ access: 'container'});
    //             console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
    //         }
    //         // Create a unique name for the blob
    //         const blobName = 'expenses' + uuidv1() + '.txt';
    
    //         // Get a block blob client
    //         const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    //         console.log('\nUploading to Azure storage as blob:\n\t', blobName);
    
    //         // Upload data to the blob as a string
    //         const data =  JSON.stringify(await req.user.getExpenses());
    
    //         const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    //         console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));
    
    //         //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
    //         const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
    //         res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
    //     } catch(err) {
    //         res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    //     }
    
    // };