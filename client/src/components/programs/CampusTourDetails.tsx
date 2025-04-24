import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialShare } from "@/components/social";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CampusTourDetails = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">MPC Campus Tour 2025: A Better Ghana Through Intellectual Revolution</h1>
        <p className="text-lg text-muted-foreground mb-6">
          A nationwide campus tour (May 17 – June 10, 2025) that seeks to spark an intellectual awakening 
          among Ghana's youth. Inspired by Kwame Nkrumah's vision, the campaign engages students at 
          schools and universities across Ghana.
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="bg-primary/10">May 17 - June 10, 2025</Badge>
          <Badge variant="outline" className="bg-secondary/10">Multiple Venues</Badge>
          <Badge variant="outline" className="bg-accent/10">Free Entry</Badge>
        </div>
        <div className="flex justify-end">
          <SocialShare 
            title="MPC Campus Tour 2025: A Better Ghana Through Intellectual Revolution"
            description="Join our nationwide campus tour engaging students about intellectual revolution and policy innovation across Ghana"
            variant="inline"
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-10">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="topics">Key Topics</TabsTrigger>
          <TabsTrigger value="pillars">Campaign Pillars</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-bold">Campaign Strategy</h3>
              <p>
                The Movement for Positive Change Campus Tour is a nationwide initiative designed to 
                engage with Ghana's youth at educational institutions across the country. Through 
                a series of events spanning May to June 2025, the tour aims to spark an intellectual 
                revolution among students.
              </p>
              
              <h4 className="text-lg font-semibold mt-4">Engagement Approach</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Interactive Sessions:</strong> Each visit includes a 30-minute inspirational 
                  presentation followed by breakout discussions or Q&A, encouraging students to voice 
                  ideas on development challenges and solutions.
                </li>
                <li>
                  <strong>Community Building:</strong> The tour will spur formation of "Intellectual 
                  Revolution Clubs" at each school to continue debates, reading circles, and project 
                  ideas beyond the tour.
                </li>
                <li>
                  <strong>Media & Materials:</strong> Informative handouts and digital resources summarizing 
                  key points in both English and local languages, including infographics on Ghana's economic 
                  history and comparative development models.
                </li>
                <li>
                  <strong>Virtual Components:</strong> In addition to physical stops, virtual talks and 
                  webinars will reach remote students and the Ghanaian diaspora.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="pt-6">
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold mb-4">Full Tour Schedule</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">May 17, 2025 - University of Ghana, Legon</h4>
                  <p className="text-sm text-muted-foreground">Launch Rally & Keynote</p>
                  <p className="mt-2">
                    Official launch with keynote on "A Ghana Beyond Aid – Our Generation's Call" 
                    emphasizing self-reliance, followed by Q&A with students and press.
                  </p>
                </div>
                
                <div className="border-l-4 border-secondary pl-4 py-2">
                  <h4 className="font-semibold">May 19, 2025 - Achimota School (High School)</h4>
                  <p className="text-sm text-muted-foreground">Seminar</p>
                  <p className="mt-2">
                    "Harnessing Youth Minds for National Development" – interactive workshop with younger 
                    students to inspire critical thinking.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">May 21, 2025 - University of Cape Coast</h4>
                  <p className="text-sm text-muted-foreground">Town-hall Talk</p>
                  <p className="mt-2">
                    "Education Reform and Cultural Confidence" – discussing decolonizing the curriculum 
                    and promoting STEM. Features a panel of UCC lecturers/alumni.
                  </p>
                </div>
                
                <div className="border-l-4 border-secondary pl-4 py-2">
                  <h4 className="font-semibold">May 22, 2025 - Wesley Girls' High School</h4>
                  <p className="text-sm text-muted-foreground">Guest Lecture</p>
                  <p className="mt-2">
                    "Empowering the Next Generation of Women Leaders" – linking education, gender equality, 
                    and national progress.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">May 25, 2025 - KNUST (Great Hall), Kumasi</h4>
                  <p className="text-sm text-muted-foreground">Africa Day Forum</p>
                  <p className="mt-2">
                    Special Pan-African event on AU Day featuring a speech on "Industrialization in Ghana: 
                    Lessons from Asia & Africa" – drawing parallels with successful development models.
                  </p>
                </div>
                
                <div className="border-l-4 border-secondary pl-4 py-2">
                  <h4 className="font-semibold">May 27, 2025 - Prempeh College (High School)</h4>
                  <p className="text-sm text-muted-foreground">Workshop</p>
                  <p className="mt-2">
                    "Critical Thinking for Positive Change" – activities to sharpen students' critical 
                    reasoning.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4 py-2">
                  <h4 className="font-semibold">May 29, 2025 - Virtual Webinar (National)</h4>
                  <p className="text-sm text-muted-foreground">Online Event</p>
                  <p className="mt-2">
                    "Ghana's Development in a Global Context" – A live-stream talk comparing Ghana with 
                    China & South Korea, open to all schools with interactive polling.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">May 31, 2025 - University of Energy & Natural Resources, Sunyani</h4>
                  <p className="text-sm text-muted-foreground">Seminar</p>
                  <p className="mt-2">
                    "Sustainable Development & Environment" – focus on balancing industrial growth with 
                    environmental stewardship, including student tree-planting ceremony.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">June 2, 2025 - University for Development Studies, Tamale</h4>
                  <p className="text-sm text-muted-foreground">Open Forum</p>
                  <p className="mt-2">
                    "Bridging the North-South Development Gap" – discussion on inclusive growth, 
                    agriculture modernization, and research in local development.
                  </p>
                </div>
                
                <div className="border-l-4 border-secondary pl-4 py-2">
                  <h4 className="font-semibold">June 3, 2025 - Ghana Senior High School, Tamale</h4>
                  <p className="text-sm text-muted-foreground">Assembly Talk</p>
                  <p className="mt-2">
                    Motivational talk in Hausa/Twi and English, encouraging pride in local heritage and 
                    ambition to excel, featuring examples of northern Ghana's innovators.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4 py-2">
                  <h4 className="font-semibold">June 5, 2025 - Virtual Panel with Diaspora</h4>
                  <p className="text-sm text-muted-foreground">Online Discussion</p>
                  <p className="mt-2">
                    "Global Ghanaians – Brain Gain for a Better Ghana" – Engaging Ghanaian students abroad 
                    to share ideas on reversing brain drain and investing skills back home.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">June 7, 2025 - Ghana-India Kofi Annan Centre of Excellence, Accra</h4>
                  <p className="text-sm text-muted-foreground">Workshop</p>
                  <p className="mt-2">
                    "Tech and Innovation for Economic Sovereignty" – hands-on session with tech students and 
                    young entrepreneurs on digital innovation for development.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold">June 10, 2025 - Independence Square, Accra</h4>
                  <p className="text-sm text-muted-foreground">Finale Rally (Hybrid: in-person + streamed)</p>
                  <p className="mt-2">
                    Culmination of tour featuring summary of key messages, student resolutions for change, 
                    cultural performances, and an open mic for students to share pledges, concluding with a 
                    call to action.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics" className="pt-6">
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold mb-4">Key Discussion Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Ghana Beyond Aid</h4>
                  <p className="text-sm">
                    Examination of Ghana's path to economic self-reliance, including domestic resource mobilization, 
                    value addition to exports, and diversification of the economy.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Education Reform</h4>
                  <p className="text-sm">
                    Critical analysis of Ghana's education system, focusing on decolonizing curricula, 
                    integrating critical thinking, and promoting STEM education aligned with development needs.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Industrialization Models</h4>
                  <p className="text-sm">
                    Comparative studies of development paths taken by East Asian nations (Malaysia, Singapore, 
                    South Korea) and extracting applicable lessons for Ghana's context.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Cultural Confidence</h4>
                  <p className="text-sm">
                    Exploring the relationship between cultural identity, language policy, and national development, 
                    with emphasis on building confidence in Ghanaian values and traditions.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Environmental Sustainability</h4>
                  <p className="text-sm">
                    Addressing climate change challenges and sustainable development models that balance 
                    industrialization with environmental protection.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Technology & Innovation</h4>
                  <p className="text-sm">
                    Leveraging digital technologies, local innovation, and tech entrepreneurship to address 
                    development challenges and create economic opportunities.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Youth Leadership</h4>
                  <p className="text-sm">
                    Empowering youth to take active roles in community development, policy advocacy, and 
                    entrepreneurship rather than waiting for "future leadership."
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">North-South Development Gap</h4>
                  <p className="text-sm">
                    Strategies for inclusive growth that addresses regional disparities in Ghana, with focus on 
                    agricultural modernization and infrastructure development in northern regions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pillars" className="pt-6">
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold mb-4">Campaign Pillars</h3>
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Education & Critical Thought</h4>
                  <p className="mb-2"><strong>Goal:</strong> Foster a culture of critical thinking and lifelong learning.</p>
                  <p className="mb-2"><strong>Value:</strong> Every Ghanaian child deserves an education that encourages questioning, innovation, and practical skills.</p>
                  <p className="text-sm">
                    This pillar emphasizes updating curricula to focus on STEM, problem-solving, and history taught from 
                    an African perspective. The campaign highlights that an "intellectual awakening" in Ghanaian schools is 
                    the foundation for all other development goals.
                  </p>
                </div>
                
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Science, Technology & Innovation</h4>
                  <p className="mb-2"><strong>Goal:</strong> Cultivate a technologically advanced and innovative society.</p>
                  <p className="mb-2"><strong>Value:</strong> Embrace science and tech as engines of development while adapting them to Ghana's context.</p>
                  <p className="text-sm">
                    This pillar promotes investment in research, support for startups and local inventions (from agritech to fintech), 
                    and digital literacy for students. It also involves connecting with the Ghanaian tech diaspora.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Economic Sovereignty & Industrialization</h4>
                  <p className="mb-2"><strong>Goal:</strong> Achieve a self-reliant economy that adds value to its resources and competes globally.</p>
                  <p className="mb-2"><strong>Value:</strong> Self-sufficiency, productivity, and dignity in labor.</p>
                  <p className="text-sm">
                    This pillar addresses Ghana's reliance on foreign aid and raw commodity exports, advocating for an 
                    economic model where Ghana finances its own development and processes its own raw materials. The campaign 
                    echoes the sentiment of a "Ghana Beyond Aid."
                  </p>
                </div>
                
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Cultural Identity & Pan-Africanism</h4>
                  <p className="mb-2"><strong>Goal:</strong> Strengthen Ghana's cultural confidence and solidarity with African nations.</p>
                  <p className="mb-2"><strong>Value:</strong> Pride in Ghanaian and African heritage, languages, and values as the foundation for progress.</p>
                  <p className="text-sm">
                    This pillar stresses that development must not come at the cost of cultural loss; Ghana can modernize while 
                    remaining culturally sovereign. Concrete actions include promoting local languages in education and governance.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Environment & Sustainable Development</h4>
                  <p className="mb-2"><strong>Goal:</strong> Ensure that Ghana's development is environmentally sustainable and resilient to climate change.</p>
                  <p className="mb-2"><strong>Value:</strong> Stewardship of the land for future generations.</p>
                  <p className="text-sm">
                    Ghana contributes minimally to global emissions yet suffers from climate impacts. This pillar educates students on 
                    the importance of environmental protection alongside economic growth.
                  </p>
                </div>
                
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Youth Empowerment & Leadership</h4>
                  <p className="mb-2"><strong>Goal:</strong> Mobilize the energy and creativity of Ghana's youth for national development.</p>
                  <p className="mb-2"><strong>Value:</strong> Inclusivity, optimism, and proactive leadership.</p>
                  <p className="text-sm">
                    This is a cross-cutting pillar that underlies the entire campaign. MPC firmly believes that young people are not just 
                    future leaders – they can lead change now by spearheading community projects, entrepreneurship, and advocacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampusTourDetails;