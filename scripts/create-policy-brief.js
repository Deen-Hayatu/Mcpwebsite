// Using ES Module syntax
import fetch from 'node-fetch';

async function createPolicyBrief() {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const excerpt = `This policy brief examines the 'resource curse' in Ghana and Nigeria, where abundant natural resources have often led to economic volatility and underdevelopment. It analyzes historical contexts, policy responses, and offers recommendations for breaking the resource trap through diversification, transparency, and value-added processing.`;

  const policyBrief = {
    title: "The Natural Resource Trap: A Case of Ghana and Nigeria",
    date: today,
    excerpt: excerpt,
    content: `
# The Natural Resource Trap: A Case of Ghana and Nigeria

## By Mohammad Deen Hayatu

### Introduction: The Paradox of Plenty

Many countries blessed with abundant natural resources remain paradoxically poor. Economists refer to this as the "resource curse" or paradox of plenty – having plenty of resources but still being underdeveloped. In The Bottom Billion, Paul Collier described a "natural resource trap" wherein resource-rich nations often stagnate due to governance issues, volatile prices, and distorted economic structures. Ghana and Nigeria present instructive case studies of this complex challenge in West Africa, with oil, gold, and cocoa wealth yielding mixed development results.

### Historical Context: Colonization and Resource Extraction

During the colonial era, European powers structured West African economies around extraction of primary resources. In Ghana (the former Gold Coast), the British mined gold and established cocoa plantations, integrating the colony into a trade pattern of exporting raw materials and importing manufactured goods. Gold has been central to Ghana's economy for centuries.

In Nigeria, British colonial policy was similarly exploitative. The Niger Delta was once called the "Oil Rivers" – referring not to petroleum (discovered later) but to palm oil, a prized commodity for British industry. Colonial companies and authorities also extracted timber, cocoa, rubber, groundnuts, and minerals. By the 1950s, on the eve of Nigerian independence, foreign companies had discovered large petroleum deposits.

Post-colonial leaders were keenly aware of these issues. Ghana's first president, Kwame Nkrumah, warned that without economic transformation, political independence would be shallow – foreign interests would continue to dictate Africa's terms of trade (Nkrumah, 1965). Nkrumah attempted to use resource revenues for industrialization (e.g. using cocoa earnings to build the Akosombo Dam and factories), but a combination of falling cocoa prices and political pressures derailed many initiatives.

### Ghana's Gold and Cocoa: Blessings and Challenges

Ghana is often cited as a case of both the promises and perils of resource wealth. The country remains one of the world's top producers of gold and cocoa. It is Africa's second-largest gold miner and the world's second-largest cocoa exporter, contributing about 20% of global cocoa supply. These two commodities have long been pillars of Ghana's economy and national identity.

This wealth has brought Ghana significant income, but not without complications. Cocoa and gold prices operate on boom-bust cycles, which means Ghana's fiscal health can swing with global commodity markets. For example, a bumper cocoa harvest or high gold price injects revenue, whereas a price crash leaves the government with deficits. Such volatility has been a recurring issue.

Beyond macroeconomics, Ghana's reliance on gold and cocoa has had social and environmental impacts. Gold mining provides government royalties and jobs, but has also been associated with land degradation and pollution. In particular, a boom in illegal small-scale gold mining – known locally as galamsey – has scarred landscapes and contaminated rivers. Farmers in cocoa-growing regions have sold land to miners or abandoned cultivation, threatening both agriculture and water resources.

Economically, cocoa's dominance has also meant most farmers see little prosperity. Raw cocoa beans are exported to be made into chocolate abroad, so Ghana captures only a small slice of the value chain. World market fluctuations directly hit farmers' incomes.

Ghana's experience highlights that natural resources can be a double-edged sword. On one hand, gold, cocoa, and oil have fueled Ghana's GDP growth and foreign exchange reserves. On the other, over-reliance on these commodities has exposed the country to external shocks and hindered diversification.

### Nigeria's Oil Dependency and Its Costs

Nigeria presents a more cautionary tale of the resource curse. Since the 1970s, oil has utterly dominated Nigeria's economy. By 2000, petroleum made up a staggering 98% of Nigeria's export earnings. Today, Nigeria is Africa's largest oil producer, and oil revenues have funded massive government budgets – yet much of the population has seen little improvement in living standards. In fact, the country's overdependence on petroleum has created multiple economic, social, and political challenges.

During boom times, oil money pours into Nigeria's coffers, but it has often been mismanaged. Corruption became deeply entrenched: a World Bank analysis estimated that 80% of Nigeria's energy revenues benefit only 1% of the population. Enriched elites siphoned off funds, while public services remained underfunded. Even basic fuel needs were paradoxically mishandled – Nigeria, despite producing crude oil, became reliant on imported refined petroleum products due to dysfunctional domestic refineries.

The decline of Nigeria's other industries is a textbook case of Dutch disease. In the 1960s, agriculture was the backbone of Nigeria's economy – it was a leading exporter of cocoa, groundnuts, palm oil, and other crops. But as petrodollars flooded in, agriculture and manufacturing were neglected and became less competitive. Agricultural output plummeted in the 1970s and 1980s as oil rose to dominance.

Oil has also inflicted a heavy social and environmental toll in Nigeria. Nowhere is this more evident than in the Niger Delta region, the heart of Nigeria's petroleum industry. For decades, local communities there have endured frequent oil spills, gas flaring, and pollution of farmland and fisheries. The benefits of oil largely bypassed these communities, leading to deep grievances.

In sum, Nigeria's heavy reliance on oil has yielded a classic resource curse outcome: economic volatility, weak development, corruption, and conflict. However, it has also prompted Nigerian policymakers (with nudging from international partners) to seek ways out of the trap.

### Policy Responses and Reforms: Breaking the Trap?

Ghana's Policy Responses: Ghana has undertaken various strategies to avoid or mitigate the resource trap. After the painful IMF-led reforms of the 1980s, Ghana embraced more prudent economic management. In the gold mining sector, the government established regulations and participated in transparency initiatives to ensure mining revenues are recorded and taxed. When oil was discovered, Ghana acted proactively by passing the Petroleum Revenue Management Act, which created a sovereign wealth fund and mandated spending rules for oil money.

On the economic diversification front, Ghana in recent years has launched programs to reduce its commodity dependence. One flagship initiative is "One District, One Factory," aimed at establishing industrial enterprises across the country to add value to agricultural produce and minerals. In the cocoa sector, Ghana (in collaboration with Côte d'Ivoire) formed a cartel-like arrangement to negotiate better prices from global buyers and introduced a Living Income Differential to support farmers.

Nigeria's Policy Responses: Nigeria's attempts to escape the resource curse have been challenging, but not for lack of plans. As early as the 1980s, Nigeria implemented a Structural Adjustment Program under IMF guidance, aiming to reduce dependence on oil by devaluing the currency (to boost agricultural exports) and privatizing state enterprises. Some reforms, like loosening trade restrictions, did spur non-oil sectors incrementally, but oil remained the dominant source of government revenue.

Nigeria has also made moves to fix governance issues in the oil sector. In 2021, after years of deliberation, the government enacted the Petroleum Industry Act (PIA) to overhaul the regulatory framework, promote transparency, and attract investment. The PIA also aimed to allocate a share of oil company profits to local host communities – a response to grievances in the Niger Delta.

International Institutions' Perspectives: The IMF and World Bank have played significant roles in both countries' policy responses. They advocate for what can be summarized as "good governance" solutions to the resource trap: fiscal discipline, transparency, and structural reforms. For instance, the IMF often urges resource-rich countries to save windfalls and avoid excessive borrowing, noting that "stagnating incomes in sub-Saharan Africa's resource-intensive economies reflect the combined effects of falling commodity prices, social or political instability, and difficult business environments."

### Anticolonial and Anti-Imperial Critiques

No analysis of Ghana's and Nigeria's resource struggles is complete without considering anticolonial and anti-imperial viewpoints. From this angle, the resource trap is a direct outcome of imperialism – past and present. Colonialism extracted Africa's wealth for European development, and today, critics argue, a new form of imperialism continues via multinational corporations and unequal trade relations. In Ghana and Nigeria, foreign companies dominate key resource sectors, and most exports remain unprocessed raw materials, leaving little value added domestically.

There is also a political dimension to these critiques. Both Ghana and Nigeria have experienced foreign political influence tied to resources. For example, declassified documents suggest Western governments and companies were nervous about Nkrumah's resource nationalism and left-leaning policies; his overthrow in 1966 had tacit external approval, raising questions about protecting foreign business interests. In Nigeria, oil contracts and politics have long involved Western powers with geopolitical interests in the industry.

Moreover, voices from the Global South emphasize sovereignty over natural resources. Movements in both Ghana and Nigeria have demanded greater local control and better terms from foreign investors.

In summary, anticolonial critiques remind us that Ghana's and Nigeria's struggles with resource-based development are not just home-grown problems; they are entwined with global historical forces and power imbalances.

### Conclusion: Lessons Learned and the Way Forward

The experiences of Ghana and Nigeria demonstrate that natural resource abundance does not automatically translate into sustainable development or widely shared prosperity. Each country has seen positive and negative outcomes from its resource wealth, influenced by historical legacies, governance choices, global market fluctuations, and international power dynamics.

For Ghana and Nigeria to break free from the natural resource trap, several strategies appear promising, drawn from both countries' experiences and broader insights:

1. **Economic diversification** is paramount. Both countries should continue expanding non-resource sectors like manufacturing, services, technology, and high-value agriculture. Nigeria's growing tech hub in Lagos and Ghana's services sector growth are promising steps that need continued policy support.

2. **Local processing and value-addition** can capture more benefits domestically from natural resources. This means not just exporting raw cocoa, gold, or crude oil, but establishing processing facilities like chocolate factories, refineries, and jewelry production.

3. **Governance and institutional reforms** that enhance transparency, accountability, and effective resource management remain crucial. Anti-corruption measures, independent audits of resource revenues, and oversight of government contracts are essential. Ghana's relatively stronger institutions compared to Nigeria's can help explain its somewhat better outcomes.

4. **Strategic resource nationalism** that balances attracting needed investment with ensuring fair terms for the host country is vital. Both countries should continue reviewing and improving their resource contracts to maximize benefits for citizens while maintaining a stable investment environment.

5. **Environmental and social safeguards** are not optional extras but essential components of sustainable resource management. The environmental damage from oil extraction in the Niger Delta and illegal gold mining in Ghana demonstrate the long-term costs of neglecting these dimensions.

6. **Regional cooperation**, as seen in Ghana and Côte d'Ivoire's cocoa pricing initiative, can strengthen bargaining power against powerful multinational buyers and help stabilize markets.

7. **Active industrial policy** to nurture alternative sectors is vital to escape resource dependence. This includes investing resource revenues in infrastructure, education, and targeted support for promising industries.

The natural resource trap is not inevitable, and neither Ghana nor Nigeria is permanently stuck in it. With the right policies, institutions, and priorities, resource wealth can be transformed from a burden into a genuine blessing that supports sustainable and inclusive development. Both countries have made progress on these fronts over time, though challenges remain substantial. The world's still-growing demand for Africa's resources makes it all the more important to get these strategies right.
`
  };

  try {
    console.log('Sending policy brief to API...');
    console.log('Policy brief data:', JSON.stringify(policyBrief, null, 2).substring(0, 500) + '...');
    
    const response = await fetch('http://localhost:5000/api/policy-briefs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(policyBrief),
    });

    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Result:', result);
    
    if (result.success) {
      console.log('Policy brief created successfully!');
      console.log('ID:', result.policyBrief.id);
      console.log('Title:', result.policyBrief.title);
    } else {
      console.error('Failed to create policy brief:', result.message);
    }
  } catch (error) {
    console.error('Error creating policy brief:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Execute the function
createPolicyBrief().catch(error => {
  console.error('Error executing script:', error);
});