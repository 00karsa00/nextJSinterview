
export default async function handler(req: any, res: any) {
    try {
      // Make a request to the external API
      
      // Return the response data
      res.status(200).json({ error: 'Failed to fetch data' });

     } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }