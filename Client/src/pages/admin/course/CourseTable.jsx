import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";  
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";



function CourseTable() {

    const {data,isLoading} = useGetCreatorCoursesQuery();

  const navigate = useNavigate();
    
  if(isLoading) return <h1>Loading..</h1>
  
  
  return (

    <div>
      <Button onClick={()=>navigate('create')}>Create a new course</Button>

      <Table>
        <TableCaption>A list of your course.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Prize</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
             <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
              <TableCell> <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button size='sm' variant='ghost' onClick={()=> navigate(`${course._id}`)}><Edit /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      
      </Table>
    </div>
  );
}

export default CourseTable;
