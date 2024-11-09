import { pool } from '../helpers/db.js'
import { Router } from "express"
import { emptyOrRows } from '../helpers/utils.js'
import { auth } from '../helpers/auth.js'

const router = Router()


router.get ('/', (req, res) => {
    
pool.query('select * from task', (error, result) => {
        if (error) return next (error) 
    
        
    return res.status(200).json(emptyOrRows(result))
    })
})


router.post('/create', auth, (req, res, next) => {
    const { description } = req.body;

    // Validate description: it must be a non-empty string
    if (!description || description.trim() === 0) {
        return res.status(400).json({ error: 'Description is required' });
    }

    pool.query(
        'INSERT INTO task (description) VALUES ($1) RETURNING *',
        [description],
        (error, result) => {
            if (error) return next(error);  // Call next(error) if there's a database error
            return res.status(200).json({ id: result.rows[0].id });  // Return the task ID
        }
    );
});



router.delete('/delete/:id',(req, res) => {
    
    const id = parseInt (req.params.id)
    pool.query('delete from task where id = $1',
        [id],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message})
                
            }
            return res.status(200).json({id:id})
            }
            )


        }
)
export default router