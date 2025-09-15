@@ .. @@
   // Clear prefilled data when switching tabs manually
   const handleTabChange = (tab: 'ideas' | 'scripts' | 'carousel' | 'planner' | 'insights' | 'characters') => {
     if (tab !== activeTab) {
       setPrefilledScript(null);
       setPrefilledPost(null);
       setPrefilledCarousel(null);
     }
     setActiveTab(tab);
   };

   const renderActiveTab = () => {
         return (
           <CarouselTab 
             selectedModel={selectedModel} 
             creatorType={creatorType} 
             prefilledIdea={prefilledCarousel}
             onBackToIdeas={prefilledCarousel ? handleBackToIdeasFromCarousel : undefined}
             carouselsHistory={carouselsHistory}
             onAddToHistory={addToCarouselsHistory}
             onTabChange={handleTabChange}
           />
         );
   }