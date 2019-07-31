const productDefinition = {
	productID: 98765,
    blurb: 'someShortText',
    description: 'someLongHTML',
	pages: [
    	{
          componentName: 'menu',
          componentPath: 'common/menu',
          componentData: {
              title: 'My Units',
              choices: [
                  {
                      image: '',
                      label: 'Unit 0',
                      blurb: '',
                      link: ''
                  },
                  {
                      image: '',
                      label: 'Unit 1',
                      blurb: '',
                      link: ''
                  }
                  
              ]
          }
        },
    	{
          componentName: 'menu',
          componentPath: 'common/menu',
          componentData: {
              title: 'Unit 0',
              choices: [
                  {
                      image: '',
                      label: 'Sample Chapters',
                      blurb: '',
                      link: ''
                  }
                  
              ]
          }
        },
    	{
          componentName: 'menu',
          componentPath: 'common/menu',
          componentData: {
              title: 'Sample Unit > Lesson 0',
              choices: [
                  {
                      image: '',
                      label: 'Introduction',
                      blurb: '',
                      link: ''
                  },
                  {
                      image: '',
                      label: 'Introduction',
                      blurb: '',
                      link: ''
                  }
                  
              ]
          }
        },
    	{
          componentName: 'video',
          componentData: {
              title: 'Intro to Yoga',
              videoURL: 'qwer',
              startTimeCode: 0
          }
        }
     ]
}