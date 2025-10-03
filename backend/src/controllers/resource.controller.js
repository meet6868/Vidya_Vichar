const Resource = require('../models/Resource');
const Course = require('../models/Courses');
const Teacher = require('../models/Teachers');
const Student = require('../models/Students');

const resourceController = {
  // Add a new resource to a course
  addResource: async (req, res) => {
    try {
      const { 
        course_id, 
        title, 
        description, 
        resource_type, 
        content, 
        file_url, 
        tags, 
        topic, 
        lecture_ids,
        access_level 
      } = req.body;
      
      const userId = req.user.id;
      const userRole = req.user.role;

      // Verify course exists and user has permission
      const course = await Course.findOne({ course_id });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if user is teacher of this course or a TA
      let hasPermission = false;
      let addedByRole = 'teacher';

      if (userRole === 'teacher' && course.teacher_id === userId) {
        hasPermission = true;
        addedByRole = 'teacher';
      } else if (userRole === 'student') {
        // Check if student is a TA for this course
        const student = await Student.findById(userId);
        if (student && student.is_TA && course.TA_list.includes(userId)) {
          hasPermission = true;
          addedByRole = 'ta';
        }
      }

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to add resources to this course'
        });
      }

      // Generate unique resource ID
      const resourceCount = await Resource.countDocuments({ course_id });
      const resource_id = `RES_${course_id}_${String(resourceCount + 1).padStart(3, '0')}`;

      // Create new resource
      const newResource = new Resource({
        resource_id,
        course_id,
        title,
        description,
        resource_type,
        content,
        file_url,
        tags: tags || [],
        topic,
        lecture_ids: lecture_ids || [],
        added_by: userId,
        added_by_role: addedByRole,
        access_level: access_level || 'enrolled_only'
      });

      await newResource.save();

      res.status(201).json({
        success: true,
        message: 'Resource added successfully',
        data: {
          resource: newResource
        }
      });

    } catch (error) {
      console.error('Error adding resource:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all resources for a course
  getCourseResources: async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Verify course exists
      const course = await Course.findOne({ course_id: courseId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if user has access to course resources
      let hasAccess = false;
      if (userRole === 'teacher' && course.teacher_id === userId) {
        hasAccess = true;
      } else if (userRole === 'student') {
        const student = await Student.findById(userId);
        if (student && (course.student_list.includes(userId) || course.TA_list.includes(userId))) {
          hasAccess = true;
        }
      }

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this course resources'
        });
      }

      // Get resources for the course
      const resources = await Resource.find({ 
        course_id: courseId, 
        is_active: true 
      })
      .populate('added_by', 'name username')
      .sort({ created_at: -1 });

      // Group resources by topic for better organization
      const resourcesByTopic = resources.reduce((acc, resource) => {
        const topic = resource.topic || 'General';
        if (!acc[topic]) {
          acc[topic] = [];
        }
        acc[topic].push(resource);
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        data: {
          resources: resources,
          resourcesByTopic: resourcesByTopic,
          totalCount: resources.length
        }
      });

    } catch (error) {
      console.error('Error fetching course resources:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get resources for a specific lecture
  getLectureResources: async (req, res) => {
    try {
      const { courseId, lectureId } = req.params;
      const userId = req.user.id;

      // Verify access (similar to getCourseResources)
      const course = await Course.findOne({ course_id: courseId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Get resources related to this specific lecture
      const resources = await Resource.find({ 
        course_id: courseId, 
        lecture_ids: lectureId,
        is_active: true 
      })
      .populate('added_by', 'name username')
      .sort({ created_at: -1 });

      res.status(200).json({
        success: true,
        data: {
          resources: resources,
          lectureId: lectureId,
          totalCount: resources.length
        }
      });

    } catch (error) {
      console.error('Error fetching lecture resources:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Update a resource
  updateResource: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const resource = await Resource.findOne({ resource_id: resourceId });
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check permission - only the creator or course teacher can update
      const course = await Course.findOne({ course_id: resource.course_id });
      let hasPermission = false;
      
      if (resource.added_by === userId) {
        hasPermission = true;
      } else if (userRole === 'teacher' && course.teacher_id === userId) {
        hasPermission = true;
      }

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this resource'
        });
      }

      // Update the resource
      updateData.updated_at = new Date();
      const updatedResource = await Resource.findOneAndUpdate(
        { resource_id: resourceId },
        updateData,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Resource updated successfully',
        data: {
          resource: updatedResource
        }
      });

    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Delete a resource (soft delete)
  deleteResource: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const resource = await Resource.findOne({ resource_id: resourceId });
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check permission - only the creator or course teacher can delete
      const course = await Course.findOne({ course_id: resource.course_id });
      let hasPermission = false;
      
      if (resource.added_by === userId) {
        hasPermission = true;
      } else if (userRole === 'teacher' && course.teacher_id === userId) {
        hasPermission = true;
      }

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this resource'
        });
      }

      // Soft delete the resource
      await Resource.findOneAndUpdate(
        { resource_id: resourceId },
        { is_active: false, updated_at: new Date() }
      );

      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Search resources within a course
  searchResources: async (req, res) => {
    try {
      const { courseId } = req.params;
      const { query, type, topic, tags } = req.query;
      const userId = req.user.id;

      // Build search filter
      let searchFilter = { 
        course_id: courseId, 
        is_active: true 
      };

      if (query) {
        searchFilter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } }
        ];
      }

      if (type) {
        searchFilter.resource_type = type;
      }

      if (topic) {
        searchFilter.topic = topic;
      }

      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        searchFilter.tags = { $in: tagArray };
      }

      const resources = await Resource.find(searchFilter)
        .populate('added_by', 'name username')
        .sort({ created_at: -1 });

      res.status(200).json({
        success: true,
        data: {
          resources: resources,
          searchQuery: query,
          totalCount: resources.length
        }
      });

    } catch (error) {
      console.error('Error searching resources:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = resourceController;
